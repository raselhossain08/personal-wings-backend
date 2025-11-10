import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { SystemConfig, ConfigCategory } from './entities/system-config.entity';
import { CreateConfigDto, UpdateConfigDto, BulkUpdateConfigDto } from './dto/system-config.dto';

@Injectable()
export class SystemConfigService implements OnModuleInit {
  private configCache = new Map<string, string>();

  constructor(
    @InjectModel(SystemConfig.name) private configModel: Model<SystemConfig>,
    private nestConfigService: NestConfigService,
  ) {}

  async onModuleInit() {
    // Initialize default configs on startup
    await this.initializeDefaultConfigs();
    // Load all active configs into cache
    await this.loadConfigsIntoCache();
  }

  async findAll(category?: ConfigCategory): Promise<any[]> {
    const query: any = { isActive: true };
    if (category) query.category = category;

    const configs = await this.configModel.find(query).sort({ category: 1, key: 1 }).exec();

    // Mask secret values
    return configs.map((config) => ({
      _id: config._id,
      key: config.key,
      value: config.isSecret ? this.maskSecret(config.value) : config.value,
      category: config.category,
      label: config.label,
      description: config.description,
      isSecret: config.isSecret,
      isRequired: config.isRequired,
      placeholder: config.placeholder,
      metadata: config.metadata,
      isActive: config.isActive,
    }));
  }

  async findByKey(key: string): Promise<SystemConfig | null> {
    return this.configModel.findOne({ key, isActive: true }).exec();
  }

  async getValue(key: string, defaultValue?: string): Promise<string | undefined> {
    // Check cache first
    if (this.configCache.has(key)) {
      return this.configCache.get(key);
    }

    // Check database
    const config = await this.findByKey(key);
    if (config) {
      this.configCache.set(key, config.value);
      return config.value;
    }

    // Check environment variables as fallback
    const envValue = this.nestConfigService.get<string>(key);
    if (envValue) {
      return envValue;
    }

    return defaultValue;
  }

  async create(createConfigDto: CreateConfigDto): Promise<SystemConfig> {
    const config = new this.configModel(createConfigDto);
    const saved = await config.save();
    
    // Update cache
    this.configCache.set(saved.key, saved.value);
    
    return saved;
  }

  async update(key: string, updateConfigDto: UpdateConfigDto): Promise<SystemConfig | null> {
    const config = await this.configModel.findOneAndUpdate(
      { key },
      { $set: updateConfigDto },
      { new: true },
    ).exec();

    if (config && updateConfigDto.value) {
      // Update cache
      this.configCache.set(key, updateConfigDto.value);
    }

    return config;
  }

  async bulkUpdate(updates: BulkUpdateConfigDto[]): Promise<{ updated: number; failed: string[] }> {
    const failed: string[] = [];
    let updated = 0;

    for (const update of updates) {
      try {
        const config = await this.update(update.key, { value: update.value });
        if (config) {
          updated++;
        } else {
          failed.push(update.key);
        }
      } catch (error) {
        failed.push(update.key);
      }
    }

    return { updated, failed };
  }

  async delete(key: string): Promise<void> {
    await this.configModel.findOneAndDelete({ key }).exec();
    this.configCache.delete(key);
  }

  async getByCategory(): Promise<Record<ConfigCategory, any[]>> {
    const configs = await this.findAll();
    
    const grouped: any = {
      [ConfigCategory.PAYMENT]: [],
      [ConfigCategory.AI]: [],
      [ConfigCategory.EMAIL]: [],
      [ConfigCategory.STORAGE]: [],
      [ConfigCategory.SOCIAL]: [],
      [ConfigCategory.GENERAL]: [],
    };

    configs.forEach((config) => {
      grouped[config.category].push(config);
    });

    return grouped;
  }

  async testConnection(key: string): Promise<{ success: boolean; message: string }> {
    const config = await this.findByKey(key);
    if (!config) {
      return { success: false, message: 'Configuration not found' };
    }

    // Test different integrations based on key
    try {
      if (key.includes('STRIPE')) {
        return await this.testStripeConnection(config.value);
      } else if (key.includes('PAYPAL')) {
        return await this.testPayPalConnection(config.value);
      } else if (key.includes('OPENAI')) {
        return await this.testOpenAIConnection(config.value);
      } else if (key.includes('SMTP')) {
        return { success: true, message: 'SMTP configuration saved' };
      }

      return { success: true, message: 'Configuration saved successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  private async testStripeConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
    // Simple validation
    if (apiKey.startsWith('sk_test_') || apiKey.startsWith('sk_live_')) {
      return { success: true, message: 'Stripe API key format is valid' };
    }
    return { success: false, message: 'Invalid Stripe API key format' };
  }

  private async testPayPalConnection(clientId: string): Promise<{ success: boolean; message: string }> {
    if (clientId && clientId.length > 10) {
      return { success: true, message: 'PayPal Client ID format is valid' };
    }
    return { success: false, message: 'Invalid PayPal Client ID format' };
  }

  private async testOpenAIConnection(apiKey: string): Promise<{ success: boolean; message: string }> {
    if (apiKey.startsWith('sk-')) {
      return { success: true, message: 'OpenAI API key format is valid' };
    }
    return { success: false, message: 'Invalid OpenAI API key format' };
  }

  private maskSecret(value: string): string {
    if (!value || value.length < 8) return '***';
    
    const visibleChars = 4;
    const prefix = value.substring(0, visibleChars);
    const suffix = value.substring(value.length - visibleChars);
    
    return `${prefix}${'*'.repeat(value.length - (visibleChars * 2))}${suffix}`;
  }

  private async loadConfigsIntoCache(): Promise<void> {
    const configs = await this.configModel.find({ isActive: true }).exec();
    configs.forEach((config) => {
      this.configCache.set(config.key, config.value);
    });
  }

  private async initializeDefaultConfigs(): Promise<void> {
    const existingCount = await this.configModel.countDocuments().exec();
    if (existingCount > 0) return; // Already initialized

    const defaultConfigs = [
      // Payment - Stripe
      {
        key: 'STRIPE_SECRET_KEY',
        value: this.nestConfigService.get('STRIPE_SECRET_KEY', ''),
        category: ConfigCategory.PAYMENT,
        label: 'Stripe Secret Key',
        description: 'Your Stripe secret API key for processing payments',
        isSecret: true,
        isRequired: false,
        placeholder: 'sk_test_...',
        metadata: { provider: 'Stripe', icon: 'stripe', docs: 'https://stripe.com/docs/keys' },
      },
      {
        key: 'STRIPE_PUBLISHABLE_KEY',
        value: this.nestConfigService.get('STRIPE_PUBLISHABLE_KEY', ''),
        category: ConfigCategory.PAYMENT,
        label: 'Stripe Publishable Key',
        description: 'Your Stripe publishable key for client-side integration',
        isSecret: false,
        isRequired: false,
        placeholder: 'pk_test_...',
        metadata: { provider: 'Stripe', icon: 'stripe' },
      },
      {
        key: 'STRIPE_WEBHOOK_SECRET',
        value: this.nestConfigService.get('STRIPE_WEBHOOK_SECRET', ''),
        category: ConfigCategory.PAYMENT,
        label: 'Stripe Webhook Secret',
        description: 'Webhook signing secret for verifying Stripe events',
        isSecret: true,
        isRequired: false,
        placeholder: 'whsec_...',
        metadata: { provider: 'Stripe', icon: 'stripe' },
      },

      // Payment - PayPal
      {
        key: 'PAYPAL_CLIENT_ID',
        value: this.nestConfigService.get('PAYPAL_CLIENT_ID', ''),
        category: ConfigCategory.PAYMENT,
        label: 'PayPal Client ID',
        description: 'Your PayPal REST API client ID',
        isSecret: false,
        isRequired: false,
        placeholder: 'Your PayPal client ID',
        metadata: { provider: 'PayPal', icon: 'paypal', docs: 'https://developer.paypal.com' },
      },
      {
        key: 'PAYPAL_CLIENT_SECRET',
        value: this.nestConfigService.get('PAYPAL_CLIENT_SECRET', ''),
        category: ConfigCategory.PAYMENT,
        label: 'PayPal Client Secret',
        description: 'Your PayPal REST API client secret',
        isSecret: true,
        isRequired: false,
        placeholder: 'Your PayPal client secret',
        metadata: { provider: 'PayPal', icon: 'paypal' },
      },
      {
        key: 'PAYPAL_MODE',
        value: this.nestConfigService.get('PAYPAL_MODE', 'sandbox'),
        category: ConfigCategory.PAYMENT,
        label: 'PayPal Mode',
        description: 'PayPal environment mode (sandbox or live)',
        isSecret: false,
        isRequired: false,
        placeholder: 'sandbox',
        metadata: { provider: 'PayPal', options: ['sandbox', 'live'] },
      },

      // AI - OpenAI
      {
        key: 'OPENAI_API_KEY',
        value: this.nestConfigService.get('OPENAI_API_KEY', ''),
        category: ConfigCategory.AI,
        label: 'OpenAI API Key',
        description: 'Your OpenAI API key for ChatGPT integration',
        isSecret: true,
        isRequired: false,
        placeholder: 'sk-...',
        metadata: { provider: 'OpenAI', icon: 'openai', docs: 'https://platform.openai.com/api-keys' },
      },

      // Email - SMTP
      {
        key: 'SMTP_HOST',
        value: this.nestConfigService.get('SMTP_HOST', ''),
        category: ConfigCategory.EMAIL,
        label: 'SMTP Host',
        description: 'SMTP server hostname',
        isSecret: false,
        isRequired: false,
        placeholder: 'smtp.gmail.com',
        metadata: { provider: 'SMTP' },
      },
      {
        key: 'SMTP_PORT',
        value: this.nestConfigService.get('SMTP_PORT', '587'),
        category: ConfigCategory.EMAIL,
        label: 'SMTP Port',
        description: 'SMTP server port',
        isSecret: false,
        isRequired: false,
        placeholder: '587',
        metadata: { provider: 'SMTP' },
      },
      {
        key: 'SMTP_USER',
        value: this.nestConfigService.get('SMTP_USER', ''),
        category: ConfigCategory.EMAIL,
        label: 'SMTP Username',
        description: 'SMTP authentication username',
        isSecret: false,
        isRequired: false,
        placeholder: 'your-email@gmail.com',
        metadata: { provider: 'SMTP' },
      },
      {
        key: 'SMTP_PASS',
        value: this.nestConfigService.get('SMTP_PASS', ''),
        category: ConfigCategory.EMAIL,
        label: 'SMTP Password',
        description: 'SMTP authentication password',
        isSecret: true,
        isRequired: false,
        placeholder: 'your-app-password',
        metadata: { provider: 'SMTP' },
      },
      {
        key: 'FROM_EMAIL',
        value: this.nestConfigService.get('FROM_EMAIL', ''),
        category: ConfigCategory.EMAIL,
        label: 'From Email',
        description: 'Default sender email address',
        isSecret: false,
        isRequired: false,
        placeholder: 'noreply@personalwings.com',
        metadata: { provider: 'SMTP' },
      },
      {
        key: 'FROM_NAME',
        value: this.nestConfigService.get('FROM_NAME', 'Personal Wings'),
        category: ConfigCategory.EMAIL,
        label: 'From Name',
        description: 'Default sender name',
        isSecret: false,
        isRequired: false,
        placeholder: 'Personal Wings',
        metadata: { provider: 'SMTP' },
      },

      // Storage - Cloudinary
      {
        key: 'CLOUDINARY_CLOUD_NAME',
        value: this.nestConfigService.get('CLOUDINARY_CLOUD_NAME', ''),
        category: ConfigCategory.STORAGE,
        label: 'Cloudinary Cloud Name',
        description: 'Your Cloudinary cloud name',
        isSecret: false,
        isRequired: false,
        placeholder: 'your-cloud-name',
        metadata: { provider: 'Cloudinary', icon: 'cloudinary', docs: 'https://cloudinary.com/documentation' },
      },
      {
        key: 'CLOUDINARY_API_KEY',
        value: this.nestConfigService.get('CLOUDINARY_API_KEY', ''),
        category: ConfigCategory.STORAGE,
        label: 'Cloudinary API Key',
        description: 'Your Cloudinary API key',
        isSecret: false,
        isRequired: false,
        placeholder: 'Your API key',
        metadata: { provider: 'Cloudinary', icon: 'cloudinary' },
      },
      {
        key: 'CLOUDINARY_API_SECRET',
        value: this.nestConfigService.get('CLOUDINARY_API_SECRET', ''),
        category: ConfigCategory.STORAGE,
        label: 'Cloudinary API Secret',
        description: 'Your Cloudinary API secret',
        isSecret: true,
        isRequired: false,
        placeholder: 'Your API secret',
        metadata: { provider: 'Cloudinary', icon: 'cloudinary' },
      },
    ];

    await this.configModel.insertMany(defaultConfigs);
  }
}
