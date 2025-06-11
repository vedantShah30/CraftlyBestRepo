# Craftly

## Overview

**Craftly** is a web solution designed to enable users to easily create personalized and professional websites without the need of coding expertise. Using **ReactJS** for the frontend and
**NodeJS** for the backend, the platform provides a cohesive environment that simplifies the process of website creation, editing, and management. It offers tailored design recommendations for both individuals and businesses. Focusing on enhancing user experience, innovation, and flexibility, the platform ensures a smooth and enjoyable experience through every step of the design journey.

This text-to-website generator was developed by students of Barak Hostel, IIT Guwahati, as part of the Kriti Product Development Problem Statement.

---

## Features

1. **AI-Driven Template Refinement**:

- The platform uses OpenAI’s technology to process user input and generate customized webpage templates based on specific needs.
- The AI ensures that templates are relevant and result in high-quality, personalized designs for various applications.

2. **Responsive Design**:

- Websites are optimized for all screen sizes, offering a consistent user experience on both mobile and desktop devices.
- Mobile interfaces are designed for easy touch interactions, ensuring smooth navigation on smaller screens.

3. **Customization Options**:

- Users can modify layouts, typography, interactive features, and more to create a website that represents their brand identity.
- Logos, color schemes, and fonts can be easily incorporated into the design.

4. **Code Access**:

- Developers can access the code to implement custom features, improve performance, or refine functionality.
- This flexibility allows advanced users to make adjustments or add new elements as needed.

5. **Drag-and-Drop Editing**:

- The drag-and-drop interface allows users to easily arrange content and design elements without coding knowledge.
- It simplifies the website creation process, allowing for quick adjustments and layout changes.

6. **Re-Prompting and Refining**:

- The AI refines design suggestions based on user input, adjusting the design to meet evolving requirements.
- Prompts can be modified to guide the AI in optimizing the final design.

7. **Easy Onboarding**:

- The platform offers a user-friendly interface to help new users get started quickly with website creation.
- Intuitive controls ensure users can begin building without technical expertise.

8. **Scrollable Design**:

- Long-form content is displayed with smooth scrolling for easy navigation across the website.

9. **Top-Tier Security**:

- Websites and personal data are protected with encryption which moniters and prevents unauthorized access.

10. **Comprehensive Design Adjustment Tools**:

- Users have access to a wide range of tools to adjust and fine-tune every element of their website’s design.
- Customization options allow for precise control over layout and visual elements.

---

## Folder Structure

```
├── client
│   ├── public
│   └── src
│       ├── components
│              └── Editor
│              └── Home
│              └── Landing
│              └── Login
│       └── context
│       └── utils
│       └── App.js
│       └── index.css
│       └── index.js
│   ├── .env
│   ├── package.json
│   ├── postcss.config.js
│   └──  tailwind.config.js



├── server
│   └── src
│       ├── code
│               └── controller
│               └── models
│               └── routes
│       ├── users
│               └── controller
│               └── models
│               └── routes
│       └── cloudinary.js
│   ├── .env
│   ├── index.js
│   └──  package.json
```
## Tech Stack

- **Frontend**

  - **ReactJS**: JavaScript library for building user interfaces with a component-based architecture.

- **Backend**
  - **NodeJS**: Runtime environment for handling concurrent requests with high performance.
  - **ExpressJS**: Web application framework for building APIs and handling server-side routing.
- **Libraries used**

  - **GrapeJS**: Web-based drag-and-drop editor for intuitive content creation.

- **External APIs**:

  - **Netlify**

- **Database & Storage**

  - **MongoDB**: NoSQL, document-oriented database for flexible and scalable data storage.
  - **Firebase**: Real-time updates and user preferences management with cache for continuity.

- **Cloud Hosting & Monitoring**

  - **Cloud Platforms (Cloudinary)**: Scalable cloud hosting for handling variable traffic.
  - **MongoDB Atlas**: Monitoring system health and performance.
  - **Firebase Console**: Real-time monitoring and updates on the frontend.

- **Additional Features**
  - **Performance Monitoring**: Leveraging MongoDB Atlas and Firebase Console for system health and performance tracking.

---

## Installation & Setup

The client and server cannot be run at the same time on a same machine. Kindly use two different machines to run them at the same time.

### Frontend Setup (ReactJS)

1. Clone the repository:

   ```bash
   git clone https://github.com/aditya-samal/Craftly.git
    cd craftly
    cd client
   ```

2. Install dependencies:

   ```bash
    npm install
   ```

3. Start the ReactJS development server:

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### Backend Setup (NodeJS)

1. Navigate to the backend folder:

   ```bash
   cd server
   ```

2. Install the required Node modules:

   ```bash
   npm install
   ```

3. Start the node server:

   ```bash
   npm start
   ```

   The backend will be available at `http://localhost:8000`.

### Integration Between Frontend and Backend

- The ReactJS frontend communicates with the NodeJS backend using axios APIs for fetching data and interacting with the machine learning model.
- The backend processes user input, runs predictions using the trained AI model, and returns the results to the frontend.

---

## Usage

1. **Login**: Users can log in or sign up using the firebase authentication system.
2. **Work Model Setup**: After logging in, users are prompted to enter a custom prompt describing the type of website being created.
3. **Customize the Design**: The drag-and-drop interface allows users to modify elements such as text, images, and layout. Users can easily adjust the positions of different elements.
4. **A Floating Assistant Icon**: A floating assistant icon is always available, allowing users to enter prompts for design help, layout suggestions, or specific recommendations.
5. **Mobile Optimization**: Users can preview the website on different devices (mobile, tablet, desktop) to ensure it’s fully responsive. Additional adjustments can be made specifically for mobile devices if needed.
6. **Download the Code**: Once the design is ready, users can download the website’s code in a ZIP format.
7. **Publish the Website**: Users can choose to publish the website directly to the cloud, ensuring scalability, performance, and easy access.

---

## Future Enhancements

- **Multi-User Collaboration**:
  Allow real-time collaboration with synchronized updates and role-based access for improved teamwork.

- **Branding Alignment**:
  Introduce tools to help users easily align their websites with brand identity, including logos, colors, and fonts.

- **SEO Optimization**:
  Provide advanced SEO tools to help users optimize keywords, improve search rankings, and drive more traffic.

---

## Bugs

- **Publishing the website**:
  Users can publish the website using the netlify api but it is not successfully deploying the website it is showing "Our bots are deploying your website"

- **Themes changing**:
  When users change the colours of the fonts or background after that when they use the themes option then the themes won't work.
