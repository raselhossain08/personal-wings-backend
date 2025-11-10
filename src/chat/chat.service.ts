import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async createConversation(createConversationDto: CreateConversationDto & { createdBy: string }): Promise<Conversation> {
    const conversation = new this.conversationModel(createConversationDto);
    return await conversation.save();
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await this.conversationModel
      .find({ participants: userId })
      .populate('participants', 'firstName lastName avatar')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .exec();
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .populate('participants', 'firstName lastName avatar')
      .exec();

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  async canUserAccessConversation(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      participants: userId,
    });

    return !!conversation;
  }

  async createMessage(createMessageDto: CreateMessageDto & { sender: string }): Promise<Message> {
    // Verify user can access conversation
    const canAccess = await this.canUserAccessConversation(createMessageDto.conversation, createMessageDto.sender);
    if (!canAccess) {
      throw new ForbiddenException('Cannot access this conversation');
    }

    const message = new this.messageModel(createMessageDto);
    const savedMessage = await message.save();

    // Update conversation's last message
    await this.conversationModel.findByIdAndUpdate(createMessageDto.conversation, {
      lastMessage: savedMessage._id,
    });

    // Populate sender info
    const populatedMessage = await this.messageModel
      .findById(savedMessage._id)
      .populate('sender', 'firstName lastName avatar')
      .exec();

    return populatedMessage!;
  }

  async getConversationMessages(conversationId: string, userId: string, page: number = 1, limit: number = 50): Promise<{ messages: Message[]; total: number }> {
    const canAccess = await this.canUserAccessConversation(conversationId, userId);
    if (!canAccess) {
      throw new ForbiddenException('Cannot access this conversation');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.messageModel
        .find({ conversation: conversationId })
        .populate('sender', 'firstName lastName avatar')
        .populate('replyTo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.messageModel.countDocuments({ conversation: conversationId }),
    ]);

    // Mark messages as read for this user
    await this.markMessagesAsRead(
      messages.map(msg => (msg._id as Types.ObjectId).toString()),
      userId
    );

    return { messages: messages.reverse(), total };
  }

  async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    await this.messageModel.updateMany(
      { 
        _id: { $in: messageIds.map(id => new Types.ObjectId(id)) },
        readBy: { $ne: userId }
      },
      { 
        $addToSet: { readBy: new Types.ObjectId(userId) }
      }
    );
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.messageModel.findById(messageId);
    
    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender.toString() !== userId) {
      throw new ForbiddenException('Can only delete your own messages');
    }

    await this.messageModel.findByIdAndDelete(messageId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    const conversations = await this.conversationModel.find({ participants: userId });
    const conversationIds = conversations.map(conv => conv._id);

    const unreadCount = await this.messageModel.countDocuments({
      conversation: { $in: conversationIds },
      sender: { $ne: userId },
      readBy: { $ne: userId },
    });

    return unreadCount;
  }
}