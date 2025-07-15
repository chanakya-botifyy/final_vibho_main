# VibhoHCM - Enterprise HRMS

A comprehensive, AI-powered Human Resource Management System designed for modern enterprises. Built with React, TypeScript, and Material-UI, featuring multi-tenant architecture, advanced analytics, and seamless integrations.

## 🚀 Features

### Core Modules
- **Employee Management**: Complete lifecycle from recruitment to resignation
- **Attendance & Time Tracking**: GPS-enabled with real-time monitoring
- **Leave Management**: Multi-type leaves with approval workflows
- **Multi-Country Payroll**: Support for 50+ countries with tax compliance
- **Recruitment**: AI-powered candidate matching and ATS
- **Asset Management**: QR code-based tracking and maintenance
- **Claims & Expenses**: OCR-powered receipt processing
- **Document Management**: Secure S3 storage with version control
- **Reports & Analytics**: Real-time dashboards with predictive insights

### AI-Powered Features (Open Source)
- **Resume Parsing**: Automatic skill extraction and matching
- **Attendance Analytics**: Pattern recognition and anomaly detection
- **Predictive Analytics**: Forecasting for payroll, turnover, and hiring
- **Document Classification**: Intelligent categorization and search
- **Chatbot Integration**: WhatsApp Meta API with natural language processing
- **Fraud Detection**: Claims and expense validation
- **Performance Prediction**: Employee performance and career progression insights

### Enterprise Features
- **Multi-Tenant Architecture**: Scalable SaaS platform
- **Role-Based Access Control**: Granular permissions system
- **Real-Time Notifications**: Email, SMS, WhatsApp, and push notifications
- **Mobile-First Design**: PWA with offline capabilities
- **Dark/Light Theme**: Customizable UI with accessibility support
- **Multi-Language Support**: Internationalization with RTL support
- **Advanced Security**: End-to-end encryption, audit logging, compliance-ready

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI v5** for modern UI components
- **Zustand** for state management
- **React Query** for server state management
- **React Hook Form** for form handling
- **Recharts** for data visualization
- **Socket.io** for real-time features

### Backend (Architecture)
- **Node.js** with Express and TypeScript
- **MongoDB** with Mongoose ODM
- **Redis** for caching and sessions
- **JWT** for authentication
- **Bull Queue** for background jobs
- **Socket.io** for real-time communication

### AI & ML
- **HuggingFace Transformers** for NLP models
- **scikit-learn** for machine learning
- **Prophet** for time series forecasting
- **EasyOCR** for receipt processing
- **Sentence Transformers** for semantic search
- **FAISS** for vector similarity search

### Integrations
- **WhatsApp Meta API** for chatbot
- **SendGrid** for email/SMS
- **AWS S3** for file storage
- **Twilio** for SMS notifications
- **Firebase** for push notifications
- **Payment Gateways** for payroll processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Redis instance
- AWS S3 bucket (for file storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/vibhohcm/hrms-enterprise.git
cd hrms-enterprise

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Demo Accounts

The application includes demo accounts for testing different roles:

- **Admin**: `admin@vibhohcm.com` / `password123`
- **HR Manager**: `hr@vibhohcm.com` / `password123`
- **Manager**: `manager@vibhohcm.com` / `password123`
- **Employee**: `employee@vibhohcm.com` / `password123`

## 📱 PWA Features

VibhoHCM is built as a Progressive Web App with:

- **Offline Capabilities**: Core features work without internet
- **Push Notifications**: Real-time alerts and updates
- **App-like Experience**: Install on mobile and desktop
- **Background Sync**: Data syncs when connection is restored
- **Responsive Design**: Optimized for all screen sizes

## 🔒 Security & Compliance

- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logging**: Complete audit trail for all actions
- **Role-Based Access**: Granular permission system
- **GDPR Compliant**: Built-in data protection features
- **SOC 2 Ready**: Security controls and monitoring
- **ISO 27001 Aligned**: Information security management

## 🌐 Multi-Tenant Architecture

- **Tenant Isolation**: Complete data separation
- **Custom Branding**: White-label solutions
- **Scalable Infrastructure**: Auto-scaling capabilities
- **Regional Compliance**: Country-specific configurations
- **Multi-Currency Support**: Global payroll processing

## 📊 Analytics & Reporting

- **Real-Time Dashboards**: Live KPIs and metrics
- **Predictive Analytics**: AI-powered insights
- **Custom Reports**: Drag-and-drop report builder
- **Data Export**: Multiple formats (PDF, Excel, CSV)
- **Scheduled Reports**: Automated report delivery
- **Executive Dashboards**: C-level insights

## 🤖 AI Features

All AI features use open-source models and are self-hosted:

### Employee Management
- Resume parsing with skill extraction
- Duplicate candidate detection
- Performance prediction models
- Career progression recommendations

### Attendance & Time
- Anomaly detection algorithms
- Pattern recognition for fraud prevention
- Predictive attendance modeling
- Overtime optimization

### Recruitment
- Intelligent candidate ranking
- Skill-based job matching
- Bias reduction in hiring
- Interview scheduling optimization

### Payroll & Finance
- Cost prediction models
- Tax optimization algorithms
- Compliance validation
- Fraud detection systems

## 🔧 Configuration

### Environment Variables

```env
# Application
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_APP_NAME=VibhoHCM
REACT_APP_VERSION=1.0.0

# Database
MONGODB_URI=mongodb://localhost:27017/vibhohcm
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# File Storage
AWS_REGION=us-east-1
AWS_S3_BUCKET=vibhohcm-documents
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Communications
SENDGRID_API_KEY=your-sendgrid-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token

# AI Services
HUGGINGFACE_API_KEY=your-huggingface-key
OPENAI_API_KEY=your-openai-key (optional)
```

### Multi-Tenant Setup

```javascript
// Tenant configuration
const tenantConfig = {
  tenantId: 'company-abc',
  name: 'Company ABC',
  domain: 'abc.vibhohcm.com',
  settings: {
    branding: {
      logo: 'https://company-abc.com/logo.png',
      primaryColor: '#1976d2',
      secondaryColor: '#00796b'
    },
    features: {
      aiFeatures: true,
      multiCountryPayroll: true,
      advancedAnalytics: true
    },
    integrations: {
      whatsapp: { enabled: true, token: 'xxx' },
      sendgrid: { enabled: true, apiKey: 'xxx' },
      aws: { enabled: true, bucket: 'company-abc-docs' }
    }
  }
};
```

## 📚 API Documentation

The API is documented using OpenAPI/Swagger. Key endpoints include:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Employee Management
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/analytics` - Attendance analytics

### AI Services
- `POST /api/ai/analyze-resume` - Resume analysis
- `POST /api/ai/predict-attendance` - Attendance prediction
- `POST /api/ai/generate-insights` - AI insights
- `POST /api/ai/chatbot` - Chatbot interaction

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Docker Deployment

```bash
# Build the application
docker build -t vibhohcm-hrms .

# Run with Docker Compose
docker-compose up -d
```

### AWS Deployment

```bash
# Deploy to AWS ECS
aws ecs update-service --cluster vibhohcm --service hrms --force-new-deployment

# Deploy to AWS Lambda (serverless)
serverless deploy
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/

# Scale the application
kubectl scale deployment hrms --replicas=3
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [https://docs.vibhohcm.com](https://docs.vibhohcm.com)
- **Email**: support@vibhohcm.com
- **Slack**: [VibhoHCM Community](https://vibhohcm.slack.com)
- **GitHub Issues**: [Report a bug](https://github.com/vibhohcm/hrms-enterprise/issues)

## 🗺 Roadmap

### Q1 2024
- [ ] Advanced AI features with custom models
- [ ] Mobile app for iOS and Android
- [ ] Advanced workflow automation
- [ ] Integration marketplace

### Q2 2024
- [ ] Blockchain-based verification
- [ ] Voice-enabled interactions
- [ ] Advanced performance analytics
- [ ] Global compliance modules

### Q3 2024
- [ ] Virtual reality onboarding
- [ ] Predictive hiring models
- [ ] Advanced security features
- [ ] Multi-region deployment

---

**VibhoHCM** - Transforming Human Resource Management with AI-powered automation and enterprise-grade security.