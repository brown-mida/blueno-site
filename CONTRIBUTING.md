## Getting Started
1. Install npm v8.9.1.
2. Create a virtual environment and run
`pip install -r requirements.txt` to get the Python dependencies.
We are using Python 3.6 features.
3. Run `npm run flask` and then `npm start` to start
both the local Python server and the web UI. Use localhost:3000 to
view changes.

#### Project-Specific Notes

- We use environment variables in `.env` to keep track of credentials.
You will need to get the credentials from a current member to start developing.
- We use the scripts field in `package.json` for common administrative commands
- Shared code is kept in the `blueno` package (in a separate repository)
In general, we try to minimize shared code, promoting code to shared
only if it is well-documented and well-tested.
- The code is deployed on Google App Engine, make sure to get access
to the project so you can deploy your code.
- Productivity is extremely important to us. In particular, we like
productivity gains due to catching bugs early or automating steps.
More test cases, improved configuration, etc. are very much welcome.
    - Code quality issues that affect productivity are important
- Work incrementally and add a reasonable amount of documentation.

## Contributing Changes

### Code Review Criteria
Before considering how to contribute code, it’s useful to understand how code is reviewed, and why changes may be rejected. Simply put, changes that have many or large positives, and few negative effects or risks, are much more likely to be merged, and merged quickly. Risky and less valuable changes are very unlikely to be merged, and may be rejected outright rather than receive iterations of review.

#### Positives
- Fixes the root cause of a bug in existing functionality
- Adds functionality or fixes a problem needed by a large number of users
- Simple, targeted
- Maintains or improves consistency across Python, Java, Scala
- Easily tested; has tests
- Reduces complexity and lines of code
- Change has already been discussed and is known to committers
#### Negatives, Risks
- Band-aids a symptom of a bug only
- Introduces complex new functionality, especially an API that needs to be supported
- Adds complexity that only helps a niche use case
- Changes a public API or semantics (rarely allowed)
- Adds large dependencies
- Changes versions of existing dependencies
- Adds a large amount of code
- Makes lots of modifications in one “big bang” change

### Pull Requests
We follow the standard practice of accepting changes through PRs.

Here are things you should do before requesting a code review:
- make sure to update the Trello board
- check to see whether additional documentation or tests are needed
- run the test suite locally (`npm run pytest`)
- make sure that the TravisCI check passes


## Roadmap

- Focus on getting features that are good for demos
    - Support for different types of data (MRI, chest CT, etc.)
    - More preprocessing options
    - A cleaner UI

- Security: signed URLs
- Move away from Material UI to Ant Design
- MongoDB to Cloud SQL migration in the future

See the Trello board for more detail.

## FAQ

### How do I use to most-up-to-date `blueno`?
Update your local environment `pip install git+https://github.com/elvoai/elvo-analysis.git#egg=blueno[cpu]`

In the future, we'll want to go and version blueno in requirements.txt

### How do I deploy `blueno`?
Run `npm run deploy`.

### Where do I get the credentials?
At the moment (7/30/2018), from Luke or Andrew.