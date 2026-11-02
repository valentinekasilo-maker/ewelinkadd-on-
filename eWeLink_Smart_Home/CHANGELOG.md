# Changelogs

## v2.0.2
- **Fix Devices Offline in eWeLink App**: Automatically auto-adopt and lock onto the primary Virtual Gateway (`abf800656b` / `Device00656b`) holding existing sub-devices.
- **Auto Online Broadcast**: Keepalive engine sends `type: 2` (WS_ONLINE) messages and parameter state updates to CoolKit WebSocket immediately upon connection and every 60s.
- **Fail-Safe Device Sync**: Protect `/api/ha-devices/list` and background sync worker against CoolKit API rate limits and network latency.
- **Non-Blocking Bottom Dock UI**: Positioned Sync control bar at bottom-left corner (`bottom: 24px; left: 24px`) with drag handle and minimize icon, preventing any obstruction of login form.
- **SSL Certificate Verification Bypass**: Enable `NODE_TLS_REJECT_UNAUTHORIZED=0` and HTTPS agent bypass for `eu-apid.coolkit.cc`.
- **Conflict Abort Disabled**: Converted fatal abort into warning to prevent container startup failures.

## v2.0.1
- Fix SSL certificate timeout to `eu-apid.coolkit.cc`.
- Disable fatal conflict detection abort on startup.


Maintenance for the **eWeLink Smart Home** add-on has ceased as of version **1.4.6**. We have released a [new eWeLink Smart Home add-on](https://github.com/iHost-Open-Source-Project/hassio-ihost-addon), which already supports the same devices as the legacy version and will continue to expand support for more SONOFF devices in the future. However, the new add-on no longer provides a built-in device control UI, nor does it support syncing Home Assistant devices back to the eWeLink cloud.

## v1.4.6

-   A **Conflict Detection** toggle has been added and is enabled by default. When enabled, the new add-on will automatically stop the legacy add-on while in use. You may disable this option manually if needed.

## v1.4.5

-   Fix docker image build error

## v1.4.4

-   Fix SSE connection issue

## v1.4.3

-   Fix multi-channel device state bug

## v1.4.2

-   Fix redirect URL bug

-   Fix device controlling bug

## v1.4.1

-   Fix color temperature bug

## v1.4.0

-   Support new devices

-   Update Web UI

## v1.3.3

-   Update sync lovelace settings

-   Update some device protocols

## v1.3.2

-   Update sync device table

-   Support new devices

## v1.3.1

-   Update some device API

-   Fix some API bugs

## v1.3.0

-   Update WebSocket message handler

## v1.2.9

-   Fix get wrong number device bug

## v1.2.8

-   Support some new devices

## v1.2.7

-   Fix device online status bug

## v1.2.6

-   Fix login button style bug

## v1.2.5

-   Support NS Panel

-   Update log output format

## v1.2.4

-   Added new feature "Sync Home Assistant Devices"

## v1.2.3

-   Update Dockerfile build script

## v1.2.2

-   Fixes of known issues

## v1.2.1

-   Fixes of known issues

## v1.2.0

-   Added a "Sync Lovelace Card" button to choose whether to synchronize the  card to the Lovelace
-   Support zigbee water sensor
-   Fixes of known issues

## v1.1.0

-   Support for ceiling fan with light
-   Support for dimmer switch
-   Support for MINI-R3
-   Fixed sync error of channel 1 of multi-channel device
-   Improved LAN control

## v1.0.0

-   Fixed known issues
