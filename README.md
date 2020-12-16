A full stack application for an artist to keep all her favorite artworks across multiple media in one place.

A Node.js backend powers the Express file server, and makes use of EJS to create templates for the frontend.

Artwork data is persisted by Google Cloud Storage, and user login information is stored with MongoDB.

The artist can login to upload new artwork, delete current artwork, or change the name or category of the artwork. The UI automatically lays out any new or updated art, and removes the deleted items.
