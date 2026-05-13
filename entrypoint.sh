#!/bin/sh
set -e

modprobe wireguard 2>/dev/null || true

mkdir -p /dev/net
mknod /dev/net/tun c 10 200 2>/dev/null || true

wg-quick up /etc/wireguard/wg0.conf

nginx -g 'daemon off;'
