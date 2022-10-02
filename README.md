# Watering Hole

## App Features:
### Query or Area search for bars
Connected Google Maps API to perform searches for bars.

Can be a **Query Search**: [^1]
- *cocktail bars in Melbourne*
- *rooftop bars in Fitzroy*
- *Hotel Esplanade*

Can be an **Area Search**: [^2]
- Area: *Fitzroy*, Radius: *2000* (metres)
- Area: *Manhattan*, Radius: *2000* (metres)
- Area: *Los Angeles*, Radius: *2000* (metres)


### Favourite and bucketlist bars
Users can **favourite** or **bucketlist** bars they search for.


### Add search tags to bars
Users can add **search tags** to the bars they search for.
These search tags can be grabbed from the *global* list of search tags available to every user, or they may create their own *my tags*.
*Examples:*
- *Rooftop*
- *Cocktail*
- *Whiskey*
- *Nightclub*


### Search through favourites
Users can perform complex query searches to find the bar that they desire.
**Parameters include:**
- Open now
- Location
- Search tags
- Price Level

### Social Activity
#### Social Feed
The user can add friends and see their recent activity ordered as a social feed.
These include events:
- *User* visited a *bar*
- *User* favourited a *bar*
- *User* bucketlisted a *bar*
- *User* added a new search tag: *tag*

#### User Profile
- Recent Bars
- Friends List
- Favourites and Bucketlisted
- Search tags

### User Authentication
Users may login via Facebook to sign in to their account

[^1]: https://developers.google.com/maps/documentation/places/web-service/search-text
[^2]: https://developers.google.com/maps/documentation/places/web-service/search-nearby

## Deployment
App has been deployed on Heroku.
https://my-watering-hole.herokuapp.com
