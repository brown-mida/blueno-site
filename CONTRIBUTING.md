### Getting Started
Install npm v8.9.1. Run `yarn flask` and then `yarn start` to start
both the local Python server and the web UI.

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
Run `yarn deploy` or `npm run deploy`