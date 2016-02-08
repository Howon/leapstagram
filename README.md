
# About
Location-based Instagram explorer using Leap Motion.

#Demo
https://www.youtube.com/watch?v=F7Eprwk3RRU
## Inspiration
We wanted to create a new, interactive way to explore the urban landscape. We sought to integrate social media, which we think is a highly prominent form of communication in high-population environments.

## What it does
Leapstagram allows users to navigate over a map with gestures using the leap motion device. It supports panning and zooming. In addition, with the upward flick of the wrist, Leapstagram displays geotagged Instagram photos taken near the current location. These photos can be browsed with swiping hand gestures.

## How we built it
We use the Leap Motion javascript SDK to pick up hand gestures, and translated these gestures into meaningful actions in our map environment. Map scrolling is accomplished via the Google Maps API, while pictures are sourced with the Instagram API.

## Challenges we ran into
It was incredibly difficult to get the hand motions right! We had to tweak sensitivity levels and introduced delays to implement some of the cooler functionality.

# Running the Server

1. Make sure you have virtualenv installed. If you don't, run
```
$ pip install virtualenv
```

2. Setup the virtualenv
```
$ virtualenv --no-site-packages env
$ source env/bin/activate
```

3. Install the requirements
```
$ pip install -r requirements.txt
```

4. Run the dev server
```
$ python app.py
```

The server should now be running on http://localhost:5000


# Team
Howon Byun
David Lee
Kevin Lin
Ethan Adams
