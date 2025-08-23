#

## Issue

Here I will describe what I thought about a post in the Katalon User Forum:

- https://forum.katalon.com/t/katalon-10-3-1-smart-wait-is-now-much-much-slower/180887

>mateusz.mysliwiec

>Hello, we just updated Katalon to 10.3.1, according to the Katalon Studio Release Notes: "Version 10.x | Katalon Docs"

>>”This update addresses Smart Wait timeout issues, improves recorder handling for custom date pickers, enhances license management, and resolves several execution-related defects to deliver a smoother, more reliable testing experience.”

>some of our scenarios that used to take 3m 24s now take 7m 30s - when watching scenarios, we can see that test execution is now much slower, because every UI interaction is delayed for much longer due to smart wait.

## Point raised

The original poster wants to point out that something has changed in the v10.3.1 that caused his test run slower than before.

OK. I would tell him how to find out how the v10.3.1 differs from the previous versions.

## Where to find the Katalon Studio Souce codes

Every Katalon Studio installation bundles the source code of `com.kms.katalon.core.**` package. For example, on my Mac I find a directory

- `<Katalon Studio installation directory>/Contents/Eclipse/configuration/resource/source`

In there I find the following jar files:

- `com.kms.katalon.core/com.kms.katalon.core-sources.jar`
- `com.kms.katalon.core.webui/com.kms.katalon.core.webui-sources.jar`

In the commandline, I can unarchieve these jar files by `unzip` command:

```
$ unzip com.kms.katalon.core.sources.jar
```

Then I will get a large tree of source code files, like this:

```
~/katalon-workspace/katalon-studio-source/10.3.1/com.kms.katalon.core $ tree -L 5 .
.
├── META-INF
│   ├── MANIFEST.MF
│   └── maven
│       └── com.kms
│           └── com.kms.katalon.core
│               ├── pom.properties
│               └── pom.xml
├── com
│   └── kms
│       └── katalon
│           └── core
│               ├── annotation
│               ├── ast
│               ├── auth
│               ├── checkpoint
│               ├── common
│               ├── configuration
│               ├── constants
│               ├── context
│               ├── db
│               ├── driver
│               ├── enums
│               ├── event
│               ├── exception
│               ├── execution
│               ├── export
│               ├── helper
│               ├── http
│               ├── json
│               ├── keyword
│               ├── logging
│               ├── main
│               ├── model
│               ├── network
│               ├── preferences
│               ├── reporting
│               ├── selenium
│               ├── setting
│               ├── testcase
│               ├── testdata
│               ├── testobject
│               ├── trymonad
│               └── util
└── com.kms.katalon.core-sources.jar

41 directories, 4 files
```


@Russ_Thomas wrote in his post https://forum.katalon.com/t/the-world-wide-wait/38779/2
