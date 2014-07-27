## v0.5.0
- bump version (getting npm 4.223 wanted version so going above that..)

## v0.4.4
- bump version (not sure what happened to v0.4.3..)

## v0.4.2
- fix async 'done' bug that would cause 'restart' call to intermittently not work (task would complete before the forever restart)
- converted to a multiTask so more than one forever script/call can be managed
- support passing in options for start
- stop and restart by uid (more specific than just index/file, which could stop/restart multiple processes)
	- support searching by options as well as just file/index name to allow finer grained separation (i.e. between two processes that may have the same file/index but are different - i.e. different ports or other command options)