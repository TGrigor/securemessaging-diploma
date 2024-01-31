# Secure Chat Web Application

## Overview
This secure chat web app utilizes ASP.NET Core, SignalR, MSSQL, and JS/JQuery to deliver a peer-to-peer (P2P) messaging platform. Designed for privacy, it ensures messages are not stored on the server but in browser cookies on the client-side, encrypted using RSA and AES algorithms to thwart man-in-the-middle attacks.

## Key Features
- **P2P Messaging**: Direct user-to-user communication without server storage.
- **Encryption**: RSA and AES encryption for secure message exchange.
- **No Server-Side Message Storage**: Enhanced privacy by storing messages only in client-side cookies.
- **Azure Deployment**: Cloud hosting for scalability and accessibility.

## Security Highlights
- **Client-Side Encryption**: Protects message integrity and confidentiality.
- **No Persistent Storage**: Messages are not stored in the database to minimize data breach risks.

## Getting Started
1. **Clone the repository**: `git clone https://github.com/yourusername/securemessaging.git`
2. **Install prerequisites**: .NET Core SDK, SQL Server, Node.js.
3. **Setup**: Configure your database connections and any necessary environment variables.
4. **Run**: Launch the application and navigate to the local URL to use the chat.

## Screenshots
![Secure Chat Interface](/files/32366.jpg)
*This image captures a presentation session of the diploma project.*

## Diploma Project
This application was crafted as a diploma project, showcasing the practical application of cybersecurity in software development.

## Contributing
Feel free to fork the repo, make changes, and submit a pull request. Contributions to enhance the project are always welcome.

## Acknowledgments
Gratitude to the mentors and peers who supported this endeavor, and to the Microsoft Innovation Center in Armenia for the resources and environment conducive to this project's development.
