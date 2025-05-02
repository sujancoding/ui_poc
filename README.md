# Project
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).



## run with mock-server
Run `npm run start:proxy:mock:server'. Navigate to 'http://localhost:4200'. also mock server will run on http://localhost:3000. app will call mock api via proxy
https://kaustubhtalathi.medium.com/mock-data-for-angular-5-applications-with-json-server-part-2-final-427bd68005bb


## Execute below command in node version 17
export NODE_OPTIONS=--openssl-legacy-provider

##test comment to checkin commit (Thahir - ok to delete this line)


##Review Comments (Day 1 - 5-Mar-2022) - Muthu

1. design needs to be aligned with Figma.(Signin screen:)
2. conntent should be rendered from json file and shouldnt be hardcoded for any items.(All pages)
     - Created pipes for content load. should be used in all templates.
3. OTP Screen design changes.(OTP)
4. Add icon on top of complete profile page.(Preapproved Screen)
5. padding alignment. (Pre approved Screen)
6. confirm with karthik - Complete profile launch would be on popup ?
7. Header design and alignment( Align with Figma design)
8. Try to avoid inline css styles(At max) and reuse from external css(All)


fin dev new