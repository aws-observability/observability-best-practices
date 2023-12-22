# observability-best-practices

## Welcome

This is the source for the [AWS Observability Best Practices site](https://aws-observability.github.io/observability-best-practices/). Everyone is welcome to contribute here, not just AWS employees!

## How to run/develop this site

This site is developed with `mkdocs` which is similar to Hugo with an auto-reload feature. Just save your progress and watch it refresh your browser.

1) To get started with development, make sure you have a current version of `python` with `pip` installed.

2) Install the following packages:

```
pip install mkdocs
pip install mkdocs-material
pip install pymdown-extensions
```

For more details or assistance setting up, see:
* **mkdocs** - https://www.mkdocs.org/user-guide/installation/#installing-mkdocs
* **mkdocs-material** - https://squidfunk.github.io/mkdocs-material/getting-started/
* **pymdown-extensions** - https://facelessuser.github.io/pymdown-extensions/installation/

3) Build and run locally on http://127.0.0.1:8000/

```
mkdocs serve
```

If you want to Build and run Japanese content
```
mkdocs serve -f mkdocs.ja.yaml
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
