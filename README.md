# n8n-nodes-webinarjam

This is a n8n community node. It lets you use **WebinarJam** and **EverWebinar** in your n8n workflows.

WebinarJam and EverWebinar are webinar platforms that allow you to run live and automated (evergreen) webinars, manage registrations, and access attendee data.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Resources](#resources)

---

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

---

## Operations

### WebinarJam
The WebinarJam node supports operations such as:
- Retrieve webinars
- Manage webinar registrations
- Access attendee information

### EverWebinar
The EverWebinar node supports operations such as:
- Retrieve evergreen webinars
- Manage webinar registrations
- Access attendee information

---

## Credentials

To use these nodes, you need an API key from WebinarJam / EverWebinar.

### Prerequisites
- An active WebinarJam or EverWebinar account
- API access enabled in your account

### Authentication Method
- API Key authentication

### Setup in n8n
1. Go to **n8n → Credentials**
2. Create new credentials:
    - **WebinarJam API**
3. Enter your API key
4. Save the credentials and select them in the node

---

## Compatibility

- **Tested with:** n8n `2.1.4`
- **Minimum required version:** Not explicitly defined
- **Expected compatibility:** n8n `2.x`

These nodes were built using the **declarative-style node** approach.  
If you successfully use them with older n8n versions, please consider opening a PR to update compatibility information.

---

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [WebinarJam website](https://webinarjam.com/)
- [EverWebinar website](https://everwebinar.com/)
- [Build a declarative-style node (n8n docs)](https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/)

---

## Version history

- **0.1.0** – Initial release of WebinarJam and EverWebinar nodes
- **0.1.2** - Add dark icons for WebinarJam and EverWebinar and fix lint issues

