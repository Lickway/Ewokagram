# Ewokagram

**Project 2 Web-based CRUD app.**

## Description

This app allows the user to register an account and log in as a user. From there, the user has the ability to upload photos with comments, edit comments, and view posts from other users.

## Wireframes and user stories

(./client/images/ewokagram_wireframes.jpg)
"As an Ewok, I want to upload photos of my wire frames so I can share them with my fellow ewoks to show my success"
"As a personal trainer, I want to share photos of my personal fitness progress so I can attract more clients"
"As a photographer, I want a place to share my photos so that my art can be viewed by millions of people"
"As someone who uses the same password for everything, I want to register my account so I don't have to worry about it being hacked"

## Technologies

*   APIs
    *   Amazon S3 https://aws.amazon.com/free/?sc_channel=PS&sc_campaign=acquisition_US&sc_publisher=google&sc_medium=s3_b_rlsa_hv&sc_content=s3_e&sc_detail=amazon%20s3&sc_category=s3&sc_segment=213224374763&sc_matchtype=e&sc_country=US&s_kwcid=AL!4422!3!213224374763!e!!g!!amazon%20s3&ef_id=Wpr7gwAAAMNbZBPK:20180327145930:s
    *   This is Amazon's Cloud storage. For the purposes of this project, it was to store the user photos in their database called "Buckets".
*   Modules
    *   CREATE
        *   Allows the user to upload their photo file to the S3 bucket
        *   Allows user to add username and password to database
    *   DELETE
        *   Allows the user to delete their post from the S3 bucket
    *   UPDATE
        *   Allows the user to update their captions on their posts
    *   SHOW
        *   Allows the user to see all of the posts

## Multer middleware

*   A middleware that allows file uploads to a specified local destination. i.e. a directory.


```javascript
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "./client/images");
    },
    filename(req, file, callback) {
        callback(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

app.post("/profile/new", (request, response) => {
    const upload = multer({
        storage,
        fileFilter(request, file, callback) {
            const ext = path.extname(file.originalname);
            if (
                ext !== ".png" &&
                ext !== ".jpg" &&
                ext !== ".gif" &&
                ext !== ".jpeg"
            ) {
                return callback(response.end("Only images are allowed"), null);
            }
            callback(null, true);
        }
    }).single("userFile");
    upload(request, response, err => {
        response.render("profile");
    });
});
```

## Improvements

*   I need to figure out how to post and delete from the S3 bucket.
*   I want to give users the ability to ONLY edit and delete their own posts. So far, they can edit and delete anything.
*   I want the users to have a profile page that shows them only photos they have posted
*   I want the user to have the ability to "like" a photo and send that to an archive of all photos they've liked.
