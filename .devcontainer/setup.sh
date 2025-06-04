# This script is intended to be used only in Browser cloud environment,
# because of a issue involving bad handled preflight requests when
# the port is private from Github and Gitpod parts.
# @see https://github.com/community/community/discussions/15351
#!/bin/bash
gh codespace ports visibility 8030:public -c $CODESPACE_NAME
exit 0
