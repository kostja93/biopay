# README

This README would normally document whatever steps are necessary to get the
application up and running.

## Seed the Micro$oft Cognitive API:
1. Add some nice photos of yourself to public/cognitive_training/[Your Name]
2. edit lib/tasks/biopay.rake and add in line 18 to the array:
```
{ name: "[Your Name]", iban: "DE866413939171" }
```
3. make sure your folder's name and the name-attribute match
4. run
```
rake biopay:cognitive_setup
```

5. be like
```
RecognizeFaceService.('./public/demo.jpg')
```

6. have fun

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
