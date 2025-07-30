export interface Application {
  id: string;
  name: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const mockApplications: Application[] = [
  { id: '1', name: 'Sales Dashboard', icon: 'Laptop' },
  { id: '2', name: 'Customer Support', icon: 'Headphones' },
  { id: '3', name: 'Marketing Analytics', icon: 'BarChart3' },
  { id: '4', name: 'Project Management', icon: 'ClipboardList' },
  { id: '5', name: 'Inventory Control', icon: 'Warehouse' },
];

const botResponses: { [key: string]: string } = {
  'hello': 'Hello there! How can I assist you today?',
  'hi': 'Hi! What can I do for you?',
  'what can you do': 'I can help you with information about our applications and answer general questions.',
  'tell me about sales dashboard': 'The Sales Dashboard provides real-time insights into your sales performance, key metrics, and trend analysis.',
  'tell me about customer support': 'Our Customer Support application helps manage customer inquiries, track tickets, and improve service efficiency.',
};

export const fetchApplications = (): Promise<Application[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockApplications);
    }, 700);
  });
};

export const sendChatMessage = (message: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerCaseMessage = message.toLowerCase();
      let response = 'I am not sure how to respond to that. Can you please rephrase or ask something else?';

      for (const key in botResponses) {
        if (lowerCaseMessage.includes(key)) {
          response = botResponses[key];
          break;
        }
      }
      resolve(response);
    }, 1000);
  });
};
