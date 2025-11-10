# Personal Wings AI Chatbot - Complete Integration Guide

## Overview

The Personal Wings AI Chatbot is a powerful, production-ready customer service solution that combines OpenAI ChatGPT intelligence with direct LMS database integration. The bot can handle customer inquiries, assign tasks, search courses, check enrollments, manage orders, and provide personalized assistance.

## 🚀 Key Features

### 1. **Hybrid Intelligence System**

- **Primary**: OpenAI ChatGPT (gpt-4o-mini) with LMS-specific training
- **Fallback**: Keyword-based intent detection
- **Confidence Scoring**: 70% threshold for GPT classification
- **Context Awareness**: Maintains conversation history and user context

### 2. **Real-Time Communication**

- **WebSocket Gateway**: Instant bidirectional messaging
- **Typing Indicators**: Shows bot/agent typing status
- **Agent Handoff**: Seamless escalation to human agents
- **Session Management**: Persistent conversation tracking

### 3. **LMS Module Integration**

The bot can directly interact with ALL LMS modules:

#### Course Management

- Search courses by keyword, category, level, price
- Get course details with instructor information
- Show popular courses (by enrollment & rating)
- Recommend personalized courses based on user history

#### Enrollment Tracking

- Check enrollment status for specific courses
- View all user enrollments with progress
- Calculate completion percentage
- Verify certificate eligibility

#### Order & Payment

- Retrieve user order history
- Check order status and refund eligibility
- Find pending/processing orders
- Calculate refund windows (30-day policy)

#### User Analytics

- Get user statistics (enrollments, completions, orders)
- Calculate account age
- Track learning progress
- Personalized insights

#### Certificate Verification

- Check certificate eligibility requirements
- Validate progress, quizzes, assignments
- Provide actionable feedback on missing requirements

## 🎯 Supported Intents

| Intent              | Description                     | Actions                           |
| ------------------- | ------------------------------- | --------------------------------- |
| GREETING            | Welcome messages                | Show quick start options          |
| COURSE_INQUIRY      | Course search & recommendations | Real database search, filters     |
| ENROLLMENT_HELP     | Enrollment assistance           | View enrollments, check status    |
| PAYMENT_ISSUE       | Payment troubleshooting         | View orders, retry payment        |
| TECHNICAL_SUPPORT   | Technical issues                | Auto-create support tasks         |
| REFUND_REQUEST      | Refund processing               | Check eligibility, create request |
| CERTIFICATE_INQUIRY | Certificate verification        | Check eligibility, requirements   |
| ACCOUNT_HELP        | Account management              | Profile, password, verification   |
| COMPLAINT           | Handle complaints               | Escalate to human agent           |
| FEEDBACK            | Collect user feedback           | Store ratings, suggestions        |
| HUMAN_AGENT_REQUEST | Connect to human                | Live agent handoff                |
| GOODBYE             | Farewell messages               | End conversation gracefully       |
| GENERAL_QUESTION    | Knowledge base queries          | Search FAQs, policies             |

## 📡 API Endpoints

### REST API

#### 1. Send Message

```http
POST /ai-bot/message
Authorization: Bearer <token>

{
  "message": "Show me web development courses",
  "sessionId": "optional-session-id"
}

Response:
{
  "botResponse": "I found these courses...",
  "intent": "COURSE_INQUIRY",
  "confidence": 0.95,
  "quickReplies": ["View details", "Filter by price"],
  "actions": ["search_courses"],
  "responseType": "LIST",
  "conversationId": "conv_123",
  "sessionId": "session_456"
}
```

#### 2. Get Conversation History

```http
GET /ai-bot/conversations/:sessionId
Authorization: Bearer <token>

Response:
{
  "conversation": {
    "sessionId": "session_456",
    "userId": "user_789",
    "messages": [...],
    "context": { ... },
    "satisfaction": 4.5
  }
}
```

#### 3. Rate Bot Response

```http
POST /ai-bot/rate
Authorization: Bearer <token>

{
  "conversationId": "conv_123",
  "rating": 5,
  "feedback": "Very helpful!"
}
```

#### 4. Create Knowledge Base Entry

```http
POST /ai-bot/knowledge
Authorization: Bearer <token>
Roles: ADMIN, SUPER_ADMIN

{
  "category": "enrollment",
  "question": "How do I enroll in a course?",
  "answer": "Click 'Enroll Now' button...",
  "keywords": ["enroll", "registration", "sign up"]
}
```

#### 5. Get Bot Analytics

```http
GET /ai-bot/analytics?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
Roles: ADMIN, SUPER_ADMIN

Response:
{
  "totalConversations": 1250,
  "avgSatisfaction": 4.6,
  "intentDistribution": { ... },
  "escalationRate": 0.08,
  "avgResponseTime": 1.2
}
```

#### 6. Assign Task

```http
POST /ai-bot/task
Authorization: Bearer <token>

{
  "title": "Create course outline",
  "description": "Detailed course structure needed",
  "priority": "high",
  "dueDate": "2024-02-15"
}

Response:
{
  "taskId": "task_123",
  "status": "pending",
  "assignedTo": "bot",
  "createdAt": "2024-01-20T10:30:00Z"
}
```

#### 7. Get User Tasks

```http
GET /ai-bot/tasks
Authorization: Bearer <token>

Response:
{
  "tasks": [
    {
      "id": "task_123",
      "title": "Create course outline",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-02-15",
      "assignedBy": "bot"
    }
  ]
}
```

#### 8. Update Task Status

```http
PUT /ai-bot/tasks/:taskId
Authorization: Bearer <token>

{
  "status": "completed",
  "result": "Task completed successfully"
}
```

#### 9. Escalate to Human

```http
POST /ai-bot/escalate
Authorization: Bearer <token>

{
  "sessionId": "session_456",
  "reason": "Complex technical issue"
}

Response:
{
  "ticketId": "TICK-2024-001",
  "status": "escalated",
  "estimatedWaitTime": "3-5 minutes"
}
```

### WebSocket API

#### Connection

```javascript
const socket = io('http://localhost:3000/ai-bot', {
  auth: {
    token: 'Bearer <jwt-token>',
  },
});
```

#### Events

**Client → Server:**

```javascript
// Send message
socket.emit('message', {
  message: 'Show me my courses',
  sessionId: 'optional-session-id',
});

// Start typing
socket.emit('typing', { sessionId: 'session_456' });

// Stop typing
socket.emit('stop-typing', { sessionId: 'session_456' });

// Join session
socket.emit('join-session', { sessionId: 'session_456' });
```

**Server → Client:**

```javascript
// Bot response
socket.on('bot-response', (data) => {
  console.log('Bot:', data.message);
  console.log('Quick replies:', data.quickReplies);
  console.log('Actions:', data.actions);
});

// Bot typing indicator
socket.on('bot-typing', () => {
  console.log('Bot is typing...');
});

// Error handling
socket.on('error', (error) => {
  console.error('Error:', error.message);
});
```

## 🔧 Available Bot Actions

The bot can execute these database actions:

### Course Actions

```typescript
// Search courses
action: 'search_courses';
query: 'web development';
// Returns: Course[] with title, price, instructor, rating

// Get popular courses
action: 'get_popular_courses';
// Returns: Top 5 courses by enrollment & rating

// Get recommended courses
action: 'get_recommended_courses';
// Returns: Personalized based on user history
```

### Enrollment Actions

```typescript
// Get user enrollments
action: 'get_my_enrollments';
// Returns: All user courses with progress

// Check progress
action: 'check_progress';
context: {
  currentCourseId: 'course_123';
}
// Returns: Progress %, completed lessons, eligibility
```

### Order Actions

```typescript
// Get user orders
action: 'get_my_orders';
// Returns: Order history with status

// Get order status
action: 'get_order_status';
params: {
  orderId: 'order_123';
}
// Returns: Detailed order info, refund eligibility
```

### Certificate Actions

```typescript
// Check certificate eligibility
action: 'check_certificate_eligibility';
context: {
  currentCourseId: 'course_123';
}
// Returns: Eligibility status, requirements, progress
```

### User Actions

```typescript
// Get user statistics
action: 'get_user_stats';
// Returns: Enrollments, completions, orders, account age

// Search everything
action: 'search_everything';
query: 'python';
// Returns: Courses + instructors matching query
```

## 🎨 Frontend Integration Example

### React Component

```typescript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  quickReplies?: string[];
  actions?: string[];
  timestamp: Date;
}

export const ChatBot = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io('http://localhost:3000/ai-bot', {
      auth: { token: `Bearer ${token}` }
    });

    newSocket.on('bot-response', (data) => {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.message,
        quickReplies: data.quickReplies,
        actions: data.actions,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    });

    newSocket.on('bot-typing', () => setIsTyping(true));

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (text: string) => {
    if (!socket || !text.trim()) return;

    setMessages(prev => [...prev, {
      sender: 'user',
      text,
      timestamp: new Date()
    }]);

    socket.emit('message', { message: text });
    setInput('');
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  return (
    <div className="chatbot-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
            {msg.quickReplies && (
              <div className="quick-replies">
                {msg.quickReplies.map((reply, j) => (
                  <button key={j} onClick={() => handleQuickReply(reply)}>
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Ask me anything..."
        />
        <button onClick={() => sendMessage(input)}>Send</button>
      </div>
    </div>
  );
};
```

## ⚙️ Configuration

### Environment Variables

```env
# OpenAI Configuration (managed via System Config API)
OPENAI_API_KEY=sk-...

# JWT Configuration
JWT_SECRET=your-secret-key

# MongoDB
MONGODB_URI=mongodb://localhost:27017/personal-wings
```

### ChatGPT System Prompt

The bot is trained with LMS-specific knowledge:

- Course catalog and categories
- Enrollment process and policies
- Payment methods and refund policy
- Certificate requirements
- Technical support procedures

### Customization

You can customize the bot by:

1. Adding new intents in `ai-bot.entity.ts`
2. Implementing intent handlers in `ai-bot.service.ts`
3. Creating bot actions in `bot-actions.service.ts`
4. Adding knowledge base entries via API
5. Updating system prompts in `chatgpt.service.ts`

## 📊 Analytics & Monitoring

### Available Metrics

- Total conversations
- Average satisfaction rating
- Intent distribution
- Escalation rate
- Average response time
- User engagement
- Task completion rate

### Analytics Query

```typescript
GET /ai-bot/analytics?startDate=2024-01-01&endDate=2024-01-31

{
  "totalConversations": 1250,
  "uniqueUsers": 890,
  "avgSatisfaction": 4.6,
  "intentDistribution": {
    "COURSE_INQUIRY": 35,
    "ENROLLMENT_HELP": 25,
    "PAYMENT_ISSUE": 15,
    "TECHNICAL_SUPPORT": 10,
    "OTHER": 15
  },
  "escalationRate": 0.08,
  "avgResponseTime": 1.2,
  "taskStats": {
    "created": 120,
    "completed": 95,
    "pending": 25
  }
}
```

## 🔐 Security Features

### Authentication

- JWT-based authentication for all endpoints
- Role-based access control (RBAC)
- WebSocket authentication via token

### Authorization Levels

- **Public**: Message sending, conversation history
- **User**: Task management, enrollment queries
- **Admin**: Analytics, knowledge base management
- **Super Admin**: System configuration, bot settings

### Data Privacy

- Conversation encryption
- PII data masking
- Audit logging
- Session timeout management

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Manual Testing

```bash
# Start server
npm run start:dev

# Test REST API
curl -X POST http://localhost:3000/ai-bot/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me courses"}'

# Test WebSocket
npm install -g wscat
wscat -c "ws://localhost:3000/ai-bot" \
  -H "Authorization: Bearer <token>"
```

## 📝 Best Practices

### For Frontend Developers

1. Always handle WebSocket disconnections
2. Implement message queuing for offline users
3. Show typing indicators for better UX
4. Use quick replies for common actions
5. Display bot actions as interactive buttons

### For Backend Developers

1. Log all conversations for debugging
2. Monitor ChatGPT API rate limits
3. Implement fallback for AI failures
4. Cache frequently accessed data
5. Use database indexes for fast queries

### For Admins

1. Regularly update knowledge base
2. Review bot analytics weekly
3. Monitor escalation rates
4. Train bot with real user queries
5. Keep system prompts current

## 🚨 Troubleshooting

### Bot Not Responding

1. Check OpenAI API key in System Config
2. Verify MongoDB connection
3. Check JWT token validity
4. Review server logs

### Low Confidence Scores

1. Update system prompts
2. Add more keywords to intents
3. Expand knowledge base
4. Retrain with user queries

### High Escalation Rate

1. Improve intent detection
2. Add more bot actions
3. Update knowledge base
4. Enhance response templates

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [NestJS WebSocket Guide](https://docs.nestjs.com/websockets/gateways)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/docs/)

## 🎯 Roadmap

### Planned Features

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Image recognition for support tickets
- [ ] Advanced sentiment analysis
- [ ] Proactive notifications
- [ ] A/B testing for responses
- [ ] Integration with CRM systems
- [ ] Mobile SDK

## 🤝 Support

For issues or questions:

- Create GitHub issue
- Contact: support@personalwings.com
- Documentation: https://docs.personalwings.com/chatbot

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**License**: Proprietary - Personal Wings LMS
