import flickrapi as fapi

flickr = fapi.FlickrAPI(
                   "fadfc84cb4e9c93a7d6d06c54a170d6a",
                   "3827e3911a15707e",
                   None,
                   False)

# print f.walk.__doc__


search = flickr.walk(
        lat = "40.7484",
        lon = "73.9857",
        radius = 1)

for i in range(1, 20):
    pic = search.next()

    url = "https://farm{farm}.staticflickr.com/{sid}/{pid}_{secret}.jpg".format(
                farm = pic.get("farm"),
                sid = pic.get("server"),
                pid = pic.get("id"),
                secret = pic.get("secret"))

    print url
