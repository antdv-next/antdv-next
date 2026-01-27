---
title: Contributing
---

This guide will help you understand how to contribute to Antdv Next. Please take a few minutes to read this guide before submitting an issue or pull request.

## Code of Conduct

We use the same [Code of Conduct](https://github.com/antdv-next/antdv-next/blob/main/CODE_OF_CONDUCT.md) as the Ant Design community. We hope all contributors will abide by it. Please take the time to read it thoroughly to ensure you understand what is and isn't allowed.

## Transparent Development

All our development work is done on [Github](https://github.com/antdv-next/antdv-next). Whether it's a pull request from a team member or a community contributor, all pull requests must go through the same review process.

## Branch Management

We currently maintain two long-term branches: `main` and `feat`. If you need to fix a bug, please send a pull request to `main`. We will release a `patch` version from `main` every period of time (at most one month). If you need to add a new feature pull request, please base it on the `feat` branch. We will try to merge `feat` into `main` within two months and release a `minor` version containing new features.

:::info Why is the cycle uncertain?
We don't have a large team like Ant Design to support frequent version releases, so we can only release new versions as quickly as possible while ensuring quality. We hope everyone understands.
:::

## First Contribution

If you're not sure how to submit a Pull Request on GitHub, you can read the following article to learn:

[How to Contribute on GitHub](https://opensource.guide/how-to-contribute/)

To help you get started with your first attempt, we've marked some relatively easy-to-fix bugs and small features with [good first issues](https://github.com/antdv-next/antdv-next/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). These issues can serve as a good first attempt.

If you plan to start working on an issue, please check the comments below the issue first to make sure no one else is working on it. If no one is currently working on it, you can leave a comment to let others know you will be handling this issue to avoid duplicate work.

If someone previously commented that they would handle the issue but there has been no activity for a week or two, you can also take over the issue, but you still need to leave a comment to inform others.

## Pull Request

The Antdv Next Team will pay attention to all pull requests. We will review and merge your code, and may also ask you to make some changes or tell you why we cannot accept such changes.

**Before you send a Pull Request**, please make sure you follow these steps:

1. Make changes based on the [correct branch](#branch-management).
2. Run `pnpm install` in the project root directory.
3. If you fixed a bug or added a new feature, please make sure to write corresponding tests. This is important.

Since most of antdv-next is based on `vue-components`, sometimes you need to send a pull request to the [vue-components](https://github.com/antdv-next/vue-components) repository. If you fix a bug, we will release a patch version as soon as possible after merging your changes, and then you just need to reinstall your dependencies to use the newly released version. If your pull request adds a new feature, after your changes are merged and a version is released, you also need to send a pull request to Antdv Next to upgrade the corresponding dependencies, documentation, and TypeScript type definitions.

## Development Workflow

Our project is a monorepo by default, using [pnpm workspace](https://pnpm.io/workspaces) to manage multiple sub-packages. So before you start contributing code, please make sure you understand the basic usage of pnpm workspace.

The following steps assume you have already installed and configured pnpm.

1. Fork this repository to your personal account.
2. Clone your forked repository locally: `git clone https://github.com/xxx/antdv-next.git`.
3. Enter the project directory: `cd antdv-next`.
4. Install dependencies: `pnpm install`.
5. Run the development environment: `pnpm dev`.
6. Run code style check: `pnpm lint`.
7. Build the site: `pnpm build`.
8. Compile and build: `pnpm build:antdv`.

## Acknowledgements

Thanks to all the friends who contributed code and documentation to Antdv Next. You make this project better! We look forward to more contributors joining this project to promote the development of Antdv Next together.

<a href="https://github.com/antdv-next/antdv-next/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=antdv-next/antdv-next&max=100&columns=15" />
</a>
