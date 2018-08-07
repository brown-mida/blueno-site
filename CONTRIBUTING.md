### Getting Started
1. Install npm v8.9.1 and `yarn`.
2. Create a virtual environment and run
`pip install -r requirements.txt` to get the Python dependencies.
We are using Python 3.6 features.
3. Run `yarn flask` and then `yarn start` to start
both the local Python server and the web UI. Use localhost:3000 to
view changes.

#### Good things to know

- We use environment variables in `.env` to keep track of credentials.
You will need to get them from a current member to start developing.
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


## Roadmap

- Focus on getting features that are good for demos
    - Support for different types of data (MRI, chest CT, etc.)
    - More preprocessing options
    - A cleaner UI

- Security: signed URLs
- Move away from mMterial UI
- MongoDB to Cloud SQL migration in the future

See the Trello board for more detail.

## FAQ

### How do I use to most-up-to-date `blueno`?
Update your local environment `pip install git+https://github.com/elvoai/elvo-analysis.git#egg=blueno[cpu]`

In the future, we'll want to go and version blueno in requirements.txt

### How do I deploy `blueno`?
Run `yarn deploy` or `npm run deploy`.

### Where do I get the credentials?
At the moment (7/30/2018), from Luke or Andrew.