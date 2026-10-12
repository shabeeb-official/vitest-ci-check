## Meeting Minutes: 2025-09-30
- Send deployment notification mail to Vinod when deploying
- Cart issues was due to another team doing a deployment
- Vinod will confirm Authentication by Friday
- Went through the sheet and decided to deploy the changes by EOD
- Size and Color filter needs to be added, before starting Vinod needs to add
  the data into db and Raoof need to add include it in his response

---

## Meeting Minutes: 2025-10-01
- Change session id  to the `bz_cb-<uuid>` format
- Load more needs to be added to PLP: depended on Vinod updating Langflow
- Keyboard overlapping issue in mobile is fixed
- Send out mail to ETG for discussing the layout issues
- The size duplication is a data problem from CityBeach
- Remove unnecessary icons that is not doing anything from home page
- Remove Home page recommendations
- Discussed URL misbehavior and decided to talk with CB team
- Some image have size issues in PLP, found out the issue is from image provider
- @Raoof to test duplicate product in some queries

---

## Meeting Minutes: 2025-10-01 (Morning with Vinod)
- Discuss layout issues with Himakar
- Ask about how many days notice does they need prior to move to live
- Inform about routing issue, ask about the local change on reload
- Need to store the data across sessions, find a solution on this

## Meeting Minutes: 2025-10-01 (Morning with ETG)
- ETG worked on call to pass in the `layoutConfig`.
- The layout configuration is deployed on CityBeach development site.
- The routing issue is because the path is not in their routing.
- For the go live notice discuss with Chris he will inform ETC.

## Meeting Minutes: 2025-10-01 (Evening with Vinod)
- Reviewed the sheets with client raised issues
- Confirmed the PLP table is not updated with facet_colors and swatch_links
- Approved the session re-implementation 
  

## Meeting Minutes: 2025-10-06 (Evening with Vinod)
- Complete major works by tomorrow
- work on Authentication on Wednesday
- We don't know whey they will go live
- Vinod wants to go live as soon as possible, so we can have a few days of
  production testing
- Focus on JWT on tomorrow
- Hassan needs to join the meeting tomorrow



## Meeting Minutes: 2025-10-16
- Discussion about the cloud architecture
- What if the authentication service is down
- How is the PLP and PDP handling authentication
- Will the authentication server handle the load of around 10k users joining at
  the same time
- Checked the concurrent connections
- Discussed about the WAF
- Discussion about GKE scaling
- Vinod asked to deploy the three changes


## Meeting Minutes: 2025-10-20
- Discussed about reducing loading time
- Checked the size issue
- Checked the ETG issues with cart
- Ask the tester to test cart
- Add the loader given by Lewis
- Add price to mobile view chat window product list
- Add the size guide
- Add two decimal place to price
- Add logging to cloud run(focus on PDP)
- Create a clickup for agreeing logging
- Hassan needs to monitor on Monday after mail is sent to customers
- Hassan to converse with Tom on the GKE scaling
