# AI Customer Service Bot - Integration Guide

## Overview

The AI Bot is an intelligent customer service assistant that handles support inquiries, creates tickets, assigns tasks, and provides real-time chat support. It uses natural language processing to understand customer intent and provides contextual responses.

## Features

### 🤖 Intelligent Conversation

- **Intent Recognition**: Automatically detects 13+ intents (greetings, course inquiry, payment issues, refunds, technical support, etc.)
- **Context Management**: Maintains conversation context across messages
- **Confidence Scoring**: Measures certainty of intent detection
- **Multi-turn Conversations**: Handles complex dialogues with follow-up questions

### 💬 Real-time Chat (WebSocket)

- **Live Messaging**: Instant responses via WebSocket connection
- **Typing Indicators**: Shows when bot is processing
- **Quick Replies**: Provides suggested responses for faster interaction
- **Session Management**: Persistent conversations across multiple interactions

### 🎯 Smart Actions

- **Auto Ticket Creation**: Escalates complex issues to human agents
- **Task Assignment**: Creates support tasks automatically
- **Knowledge Base Search**: Finds relevant answers from knowledge base
- **Human Escalation**: Seamlessly transfers to human agents when needed

### 📊 Analytics & Insights

- **Conversation Metrics**: Track total conversations, resolution rate, escalations
- **Intent Distribution**: Analyze most common customer inquiries
- **Satisfaction Ratings**: Collect and analyze customer feedback
- **Response Times**: Monitor average response and resolution times

---

## REST API Endpoints

### Customer Endpoints

#### 1. Send Message to Bot

```
POST /ai-bot/chat
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "message": "I need help with my order",
  "sessionId": "optional-session-id",
  "context": {
    "orderId": "12345",
    "previousTopic": "payment"
  }
}
```

**Response**:

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "message": "I can help you with your order! Let me look into that...",
  "intent": "payment_issue",
  "confidence": 0.85,
  "responseType": "text",
  "quickReplies": ["View order status", "Request refund", "Talk to human"],
  "actions": ["check_payment_status"]
}
```

#### 2. Get Conversation History

```
GET /ai-bot/history?sessionId=<session-id>
```

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
[
  {
    "_id": "...",
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-id",
    "status": "active",
    "messages": [
      {
        "role": "user",
        "content": "Hello",
        "intent": "greeting",
        "confidence": 0.95,
        "timestamp": "2025-11-11T10:00:00Z"
      },
      {
        "role": "bot",
        "content": "Hello! How can I help you?",
        "timestamp": "2025-11-11T10:00:01Z"
      }
    ],
    "createdAt": "2025-11-11T10:00:00Z",
    "lastActiveAt": "2025-11-11T10:00:01Z"
  }
]
```

#### 3. Rate Bot Conversation

```
POST /ai-bot/rate
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "rating": "5",
  "feedback": "Very helpful and fast!"
}
```

**Response**:

```json
{
  "message": "Thank you for your feedback!"
}
```

#### 4. Escalate to Human Agent

```
POST /ai-bot/escalate
```

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "Complex issue requiring human expertise"
}
```

**Response**:

```json
{
  "message": "Successfully escalated to human agent",
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### Admin Endpoints

#### 5. Add Knowledge Base Entry

```
POST /ai-bot/knowledge
```

**Headers**: `Authorization: Bearer <token>`
**Roles**: `ADMIN`, `SUPER_ADMIN`

**Request Body**:

```json
{
  "category": "Payments",
  "question": "How long does refund processing take?",
  "answer": "Refunds are processed within 5-7 business days after approval.",
  "keywords": ["refund", "processing", "time", "days"],
  "relatedIntents": ["refund_request", "payment_issue"],
  "responseData": {
    "quickReplies": ["Request refund", "Check refund status"]
  }
}
```

#### 6. Get Knowledge Base

```
GET /ai-bot/knowledge?page=1&limit=20&category=Payments
```

**Headers**: `Authorization: Bearer <token>`
**Roles**: `ADMIN`, `SUPER_ADMIN`, `INSTRUCTOR`

**Response**:

```json
{
  "knowledge": [
    {
      "_id": "...",
      "category": "Payments",
      "question": "How long does refund processing take?",
      "answer": "Refunds are processed within 5-7 business days...",
      "keywords": ["refund", "processing"],
      "usageCount": 42,
      "helpfulCount": 38,
      "notHelpfulCount": 4
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

#### 7. Update Knowledge Base Entry

```
PATCH /ai-bot/knowledge/:id
```

**Headers**: `Authorization: Bearer <token>`
**Roles**: `ADMIN`, `SUPER_ADMIN`

#### 8. Delete Knowledge Base Entry

```
DELETE /ai-bot/knowledge/:id
```

**Headers**: `Authorization: Bearer <token>`
**Roles**: `ADMIN`, `SUPER_ADMIN`

#### 9. Get Bot Analytics

```
GET /ai-bot/analytics?startDate=2025-11-01&endDate=2025-11-11
```

**Headers**: `Authorization: Bearer <token>`
**Roles**: `ADMIN`, `SUPER_ADMIN`

**Response**:

```json
{
  "summary": {
    "totalConversations": 1250,
    "resolvedByBot": 950,
    "escalatedToHuman": 300,
    "averageSatisfaction": 4.6,
    "resolutionRate": 76
  },
  "dailyAnalytics": [
    {
      "date": "2025-11-11T00:00:00Z",
      "totalConversations": 120,
      "resolvedByBot": 95,
      "escalatedToHuman": 25,
      "averageResponseTime": 2.5,
      "averageResolutionTime": 8.3,
      "intentDistribution": {
        "greeting": 30,
        "course_inquiry": 25,
        "payment_issue": 20,
        "technical_support": 15,
        "refund_request": 10,
        "human_agent_request": 20
      }
    }
  ]
}
```

---

## WebSocket Integration

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/ai-bot', {
  auth: {
    token: 'your-jwt-token',
  },
});
```

### Events to Emit

#### 1. Join Conversation

```javascript
socket.emit('join', {
  userId: 'user-123',
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
});

// Response
socket.on('joined', (data) => {
  console.log(data); // { sessionId: '...', message: 'Connected to AI assistant' }
});
```

#### 2. Send Message

```javascript
socket.emit('message', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  message: 'I need help with payment',
  context: { orderId: '12345' },
});

// Response
socket.on('message-sent', (response) => {
  console.log(response);
  // {
  //   sessionId: '...',
  //   message: 'I can help you with payment...',
  //   intent: 'payment_issue',
  //   quickReplies: [...]
  // }
});
```

#### 3. Send Quick Reply

```javascript
socket.emit('quick-reply', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  reply: 'View my orders',
  context: {},
});
```

#### 4. User Typing Indicator

```javascript
socket.emit('typing', {
  sessionId: '550e8400-e29b-41d4-a716-446655440000',
  isTyping: true,
});
```

### Events to Listen

#### 1. Bot Typing Indicator

```javascript
socket.on('bot-typing', (data) => {
  console.log(data.isTyping); // true or false
  // Show/hide typing indicator in UI
});
```

#### 2. Bot Message

```javascript
socket.on('bot-message', (response) => {
  console.log(response);
  // {
  //   message: 'Here's the information you requested...',
  //   responseType: 'text',
  //   quickReplies: ['Option 1', 'Option 2'],
  //   actions: ['some_action']
  // }
});
```

#### 3. Human Agent Joined

```javascript
socket.on('agent-joined', (data) => {
  console.log(data);
  // { message: 'John has joined the conversation', agentName: 'John' }
});
```

#### 4. Agent Message

```javascript
socket.on('agent-message', (data) => {
  console.log(data);
  // {
  //   message: 'Hello, how can I help?',
  //   agentName: 'John',
  //   timestamp: '2025-11-11T10:30:00Z'
  // }
});
```

---

## Intent Types

| Intent                | Description                 | Example Triggers                      |
| --------------------- | --------------------------- | ------------------------------------- |
| `greeting`            | User greets the bot         | "hello", "hi", "hey"                  |
| `goodbye`             | User ends conversation      | "bye", "thanks", "goodbye"            |
| `course_inquiry`      | Questions about courses     | "what courses", "learn programming"   |
| `enrollment_help`     | Help with enrollment        | "how to enroll", "sign up for course" |
| `payment_issue`       | Payment problems            | "payment failed", "billing issue"     |
| `technical_support`   | Technical problems          | "error", "not working", "bug"         |
| `refund_request`      | Refund inquiries            | "refund", "money back"                |
| `certificate_inquiry` | Certificate questions       | "certificate", "diploma"              |
| `account_help`        | Account issues              | "forgot password", "login problem"    |
| `complaint`           | Customer complaints         | "disappointed", "bad service"         |
| `feedback`            | User feedback               | "great service", "suggestion"         |
| `human_agent_request` | Request human agent         | "talk to human", "speak to agent"     |
| `general_question`    | Fallback for unclear intent | Any unmatched query                   |

---

## Response Types

- **`text`**: Plain text message
- **`quick_reply`**: Message with suggested quick reply buttons
- **`card`**: Rich card with image, title, description
- **`list`**: List of items (courses, orders, etc.)
- **`action`**: Triggers an action (navigate, open modal, etc.)
- **`form`**: Presents a form for user input

---

## Frontend Integration Example

```javascript
// Initialize AI Bot
const initAIBot = (userId, token) => {
  const socket = io('http://localhost:3000/ai-bot', {
    auth: { token },
  });

  const sessionId = localStorage.getItem('bot-session-id') || generateUUID();
  localStorage.setItem('bot-session-id', sessionId);

  // Join conversation
  socket.emit('join', { userId, sessionId });

  // Listen for bot typing
  socket.on('bot-typing', (data) => {
    showTypingIndicator(data.isTyping);
  });

  // Listen for bot messages
  socket.on('bot-message', (response) => {
    addMessageToChat('bot', response.message);
    if (response.quickReplies) {
      showQuickReplies(response.quickReplies);
    }
  });

  // Listen for human agent
  socket.on('agent-joined', (data) => {
    addSystemMessage(`${data.agentName} has joined the conversation`);
  });

  return {
    sendMessage: (message) => {
      socket.emit('message', { sessionId, message });
      addMessageToChat('user', message);
    },
    sendQuickReply: (reply) => {
      socket.emit('quick-reply', { sessionId, reply });
    },
  };
};

// Usage
const bot = initAIBot('user-123', 'jwt-token');
bot.sendMessage('Hello, I need help');
```

---

## Best Practices

### 1. Session Management

- Store `sessionId` in localStorage for persistent conversations
- Create new session for new topics or after long inactivity

### 2. Error Handling

```javascript
socket.on('error', (error) => {
  console.error('Bot error:', error);
  showErrorMessage('Something went wrong. Please try again.');
});
```

### 3. User Experience

- Show typing indicators during bot processing
- Implement quick reply buttons for common actions
- Provide "Talk to Human" option prominently
- Allow users to rate conversations

### 4. Knowledge Base

- Regularly update knowledge base with common questions
- Monitor `usageCount` to identify popular topics
- Use `helpfulCount` and `notHelpfulCount` to improve answers

### 5. Analytics

- Track conversation success rates
- Monitor escalation patterns
- Analyze intent distribution to improve bot responses
- Use satisfaction ratings to measure quality

---

## Integration with Other Modules

### Support Tickets

When bot escalates to human, it automatically creates a support ticket with:

- Conversation history
- Detected intent
- User context
- Escalation reason

### Refunds

Bot can guide users through refund process and create refund requests:

```javascript
// Bot detects refund intent
// Guides user through requirements
// Creates refund request via API
```

### Attendance

Bot can check attendance records and certificate eligibility:

```javascript
// User: "Am I eligible for certificate?"
// Bot checks attendance records and quiz scores
// Provides eligibility status
```

---

## Extending the Bot

### Adding New Intents

1. Add intent to `BotIntent` enum in `ai-bot.entity.ts`
2. Add detection pattern in `detectIntent()` method
3. Add response logic in `generateResponse()` method
4. Update knowledge base

### Custom Actions

Implement custom actions in `generateResponse()`:

```typescript
case BotIntent.CUSTOM_ACTION:
  // Call external service
  await this.someService.performAction();
  return {
    message: 'Action completed!',
    actions: ['custom_action_name']
  };
```

### ML Integration (Future)

Replace keyword-based intent detection with ML model:

```typescript
private async detectIntent(message: string): Promise<Intent> {
  // Call ML model API
  const prediction = await this.mlService.predict(message);
  return {
    intent: prediction.intent,
    confidence: prediction.confidence
  };
}
```

---

## Summary

The AI Customer Service Bot provides:

- ✅ 13+ intent types for comprehensive coverage
- ✅ Real-time WebSocket communication
- ✅ Knowledge base management
- ✅ Automatic ticket escalation
- ✅ Conversation analytics
- ✅ Multi-turn context-aware dialogues
- ✅ Human agent handoff
- ✅ Satisfaction ratings

**Total Endpoints**: 9 REST + 4 WebSocket events

**Ready for production use!** 🚀
