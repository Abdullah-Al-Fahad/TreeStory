# 🌳 TreeStorry - Interactive Storytelling Platform with Branching Narratives 🌿

Welcome to **TreeStorry**, an interactive storytelling platform that allows users to read and create stories with branching narratives! Readers can engage with stories by making choices that impact the direction of the story, while authors can gain insights into how readers interact with their stories. The platform also tracks popular choices, providing valuable feedback for creators.

🔗 **[Live Site](https://treestorry.vercel.app/stories)**

---

## 📖 Project Overview

**TreeStorry** is designed to make storytelling interactive and immersive. Users can:
- **Read interactive stories**: Choose your path and shape the adventure.
- **Create stories**: Authors can craft complex branching narratives with multiple endings.
- **Gain insights**: Authors receive analytics on reader behavior, including:
  - Popular choices readers make at each decision point.
    

This is perfect for anyone who loves interactive fiction, choose-your-own-adventure stories, or those who want to create engaging narrative experiences for others!

---

## ✨ Key Features

1. **Interactive Reading**: Readers make choices at key moments, leading them down different narrative paths.
2. **Branching Narratives**: Stories can have multiple paths, offering a unique experience for each reader.
3. **Story Creation Tools**: Authors can easily create stories with branching decisions and multiple endings.
4. **Analytics for Authors**:
   - Track the most popular reader choices.
   
5. **Simple UI**: Clean and intuitive design for both readers and authors.

---

## 💻 Technologies Used

This project was built using the following technologies:

- **Frontend**: 
  - [React](https://reactjs.org/)
  - [Bootstrap](https://getbootstrap.com/) (for responsive and modern UI)
  
- **Backend**:
  - [Django](https://www.djangoproject.com/) (Python-based web framework)
  
- **Database**:
  - [SQLite](https://www.sqlite.org/index.html) (Lightweight, serverless database for quick data storage)

---

## 🛠️ Setup and Installation

Follow these steps to run the project locally:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/treestorry.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd treestorry
    ```

3. **Frontend Setup**:
    - Navigate to the `frontend` folder and install the dependencies:
      ```bash
      cd frontend
      npm install
      ```
    - Start the React development server:
      ```bash
      npm start
      ```

4. **Backend Setup**:
    - Navigate to the `backend` folder and set up a virtual environment:
      ```bash
      cd backend
      python -m venv env
      source env/bin/activate  # On Windows use `env\Scripts\activate`
      ```
    - Install the required Python packages:
      ```bash
      pip install -r requirements.txt
      ```
    - Apply migrations and start the Django server:
      ```bash
      python manage.py migrate
      python manage.py runserver
      ```

5. **Database Setup**:
    - The project uses SQLite, so no external database configuration is needed.

6. **Open the application**:
    - Visit `http://localhost:3000` for the frontend and `http://localhost:8000/admin` for the backend admin panel.

---

## 📊 Analytics and Insights

For authors, TreeStorry provides insightful data on how users interact with their stories:
- **Popular choices**: See which story options are selected most often.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---


**Developed by [Abdullah Al Fahad]** - Feel free to reach out for any questions or suggestions!
