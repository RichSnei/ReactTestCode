# ReactTestCode
This is the first piece of ReactJS code I wrote.  It was for an interview tech assessment.  I had to learn react in order to finish the assessment.

## The problem

The task was to implement a very minimal version of the outbox using React with the following features:

* The user can add and delete rows
* Each row has a text field for an email address and a drop-down field with a list of merit titles to choose from.
* The user can select rows to “send”, which can consist of just console.logging “Sent email to ______” and removing the row
* Rows should stay in place when the user refreshes the page (https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API may be useful here)

## Other Info 

The app was created with 'create-react-app'.  It uses ReactJS, Bootstrap (and react-bootstrap) and SASS.  It assumes that
you have nodejs 8.9 (LTS).

After cloning the source you will need to install the apps dependencies.  Use the following command.

  npm install
  
To run the app, use the following command:

  npm start
  
To view the app in your browser go to the following URL:

   http://localhost:3000
   
   