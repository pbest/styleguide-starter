# Brand Guidelines template
1. [About](#about)
2. [Start a new brand guidelines](#start-a-new-brand-guidelines)
3. [First time set up](#first-time-set-up-instructions)
4. [Structure & organization](#structure--organization)
5. [How to Update](#how-to-update)
6. [Requirements](#requirements)
7. [How to deliver](#how-to-deliver)

# About
This is the template for a brand guidelines document.  Brand guidelines are the way we deliver all brand projects to the client. [View a demo](http://ripeserver.com/brand/usrbc/) of a completed brand guidelines page.  

# Start a new brand guidelines:
*If this is your first time creating a brand guidelines doc, please see '[First Time set up instructions](#first-time-set-up-instructions)'* 


##### Step 0 – Navigate to your local brand-guidelines folder
*This folder should be your local clone of the brand-guidelines repo which holds all the completed guidelines*

 Open iTerm and navigate to the directory where you want to store the guidelines, usually like this 
  ``` 
  cd /htdocs/brand-guidelines
  ```
##### Step 1 – Clone this repository
*Don't forget to change 'client-name-here' to the client's name!!*
   ```
   git clone https://github.com/ripestudios/brand-guidelines-template.git client-name-here
   ```
*Once you've cloned the repository, make sure you delete the `.git` folder and then commit & push to the brand-guidelines repo*  
##### Step 2 – Install dependencies
   ```
   sudo npm install
   ```
##### Step 3 – Stand up the project
   ```
   gulp
   ```
   A successful `gulp` command will result in a browser window opening automatically with a page that looks [like this](http://ripeserver.com/brand/demo/)
   
# First time set-up instructions 

#### Step 1 – Install the following tools
- [iTerm](https://www.iterm2.com/)
- [Sublime Text 3](http://www.sublimetext.com/3)
- [Sublime Text Package Control](https://packagecontrol.io/installation)
- [Node](https://nodejs.org/en/)

#### Step 2 – Install Jade syntax highlighting
Use the Sublime Text package control to add JADE:
- Open Sublime Text
- Call package manager: `cmd + shift + p`
- Choose `Install Package`
- Search for `Jade`.  Click to install
- Confirm by saving a new document as a `.jade` file and check that the bottom right corner says "Jade" and not HTML or Plain Text

#### Step 3 – Create a folder to store all brand guidlines
Open iTerm and type each the following commands:
```
sudo mkdir /htdocs
sudo mkdir /htdocs/brand-guidelines
cd /htdocs/brand-guidelines
```

Now you're ready to go!! Proceed to the [Start a new brand guidelines](#start-a-new-brand-guidelines) section

# Structure & organization
You only need to edit the "build" folder. This stands for "source".  The structure is:
```
app/
brand-files/
guidelines/
index.jade
```
There are the folders: 
- *app* – mostly ignore this, unless you're changing the guidelines design & functionality
- *brand-files* – this is where all the deliverables are stored - logos, font files, packages, email signatures, etc
- *guidelines* – this is the content of the guidelines page.  This allows you to write information about the deliverables and add photos, sample content, etc
- *index.jade* – this is where you set the client branding variables, change any navigation, add/remove/change the order of page sections

# How to update
- Step 1 – Once your guidelines are up & running, open the `build` folder in Sublime
- Step 2 – Open `index.jade` and update all variables listed under `applyClientBrand`
- Step 3 – Update the file `brand-files/email-signature/variables.jade` with the default information for this client
- Step 3 - Start editing content in the `guidelines/` folder based on the exported assets and specific client needs

Happy editing!!

#### Creating the email signature
1. Upload logo to a permanent image host ([imgur](imgur.com) or [postimg.org](postimg.org))
   - Make sure image is saved @ 2x
   - Record the dimensions, (WxH) you'll need to add it later
   - Make sure the image file is small (5kb or less ideally)
2. Find `variables.jade` in the `brand-files/email-signature` folder
3. Add default name (usually the project decision maker), basic branding info, link the image
4. Save & you're done!

#Requirements
At the bare mimumum all Brand Guidelines must have:
- Logo
- Logo Configurations
- Color Palette
- Typography
- Email Signature

#How to deliver
Now that you are done creating a brand's guidelines, its time to launch!!

#### Step 1 – Build the project for distribution
In the command line, `cd` to the directory for this brand guidelines and run
   ```
   gulp build
   ```
This will generate a directory called `dist/` at the project's root level.  This is a folder you can drop right onto any webserver.  **FYI: There are no server-side dependencies**. 

#### Step 2 – Connect to Ripeserver
Use our FTP credentials in 1password for Ripeserver and login.  Navigate to the `brand` directory within our web files. 

#### Step 3 – Upload the guidelines
Take the generated directory named `dist` and upload it to the brand folder..  Once its uploaded, rename it based on the client:  The URL structure should be: http://ripeserver.com/brand/client-name

#### Step 4 – Upload to client's server
If we are designing a website for this client, make sure its uploaded to their server at: http://clientURL/brand/




 

