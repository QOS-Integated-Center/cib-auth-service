# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Set the environment variables
ENV PORT=8090
ENV DB_URL=mongodb+srv://qosbot:qosbot@microsrv.j8ond.mongodb.net/qos-cib-auth-service?retryWrites=true&w=majority
ENV DB_PASSWORD=
ENV SECRET=ECF63B+oaWON3YbYzBi9gXn+4d+q64NZTSwk8Vf1
ENV SMTP_HOST=smtp.gmail.com
ENV SMTP_PORT=587
ENV SMTP_USERNAME=israeladeyeyee@gmail.com
ENV SMTP_PASSWORD=hislove22

# Expose the port that the Node.js application will listen on
EXPOSE $PORT

# Start the Node.js application
CMD ["npm", "start"]