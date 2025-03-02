# Taskify Project

Taskify is a task management application that helps users stay organized by allowing them to create, manage, and track their tasks.

## Features

- User authentication
- Create, update, and delete tasks
- Responsive design

## Technologies Used

- React
- Next.js
- TypeScript
- Zustand for state management
- Axios for HTTP requests
- Zod for schema validation
- Tailwind CSS and shadCN for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/taskify.git
   cd taskify
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

### Building for Production

1. Build the application:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Folder Structure

```
/taskify
├── app
│   ├── (private)
│   │   ├── create-task
│   │   │   └── page.tsx
│   │   └── ...
│   └── ...
├── components
│   ├── ui
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── button.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   └── Loader.tsx
├── lib
│   └── AxiosInstance.ts
├── zustand
│   └── authStore.ts
└── ...
```

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

### License

This project is licensed under the MIT License.
