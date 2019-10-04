import React from 'react';
import { List, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

// Custom components
import Home from 'src/components/info/Home';
import Events from 'src/components/info/Events';
import Contact from 'src/components/info/Contact';

// Images
import topImage from '../../static/img/home/walking_full.jpg';
import topPortImage from '../../static/img/home/walking2_full_portrait.jpg';
import eventsImage from '../../static/img/home/looking_down_full.jpg';
import eventsPortImage from '../../static/img/home/looking_down_portrait.jpg';
import sternGroveImage from '../../static/img/home/woods.jpg';
import tripImage from '../../static/img/home/mapImage.png';
import sfImage from '../../static/img/home/golden_gate.jpg';
import usImage from '../../static/img/home/laugh2_full.jpg';
import usPortImage from '../../static/img/home/laugh2_portrait.jpg';
import contactImage from '../../static/img/home/looking_back_full.jpg';
import faqImage from '../../static/img/home/cherry_full.jpg';
import faqPortImage from '../../static/img/home/cherry_portrait.jpg';
import sternGroveMap from '../../static/img/venueMap.png';

export const content = [{
  name: 'top',
  title: 'Home',
  speed: '0.9',
  inMainPage: true,
  component: Home,
  image: topImage,
  imagePort: topPortImage,
}, {
  name: 'events',
  title: 'The Events',
  speed: '0.5',
  inMainPage: true,
  component: Events,
  image: eventsImage,
  imagePort: eventsPortImage,
}, {
  name: 'stern-grove',
  title: 'Stern Grove',
  inMainPage: true,
  speed: '0.7',
  image: sternGroveImage,
  sections: [{
    title: 'Trocadero Clubhouse',
    description: 'The Trocadero Clubhouse is located in Stern Grove, a park in southwest San Francisco. The ceremony wil be outside and there is a small indoor area for the reception, but if the weather cooperates we can use the outdoor spaces as well. Please bring an extra layer to keep cozy!',
  }, {
    title: 'Getting There',
    description: 'There are several options for getting to the venue. Please keep in mind, once you are at the entrance to the park on 19th Avenue and Sloat Boulevard, there is still a steep driveway down to the clubhouse.',
    content: (
      <List relaxed>
        <List.Item>
          <img src={ sternGroveMap } style={{ maxWidth: '600px', width: '90%' }} />
        </List.Item>
        <List.Item>
          <Header sub>Public Transit</Header>
          From Union Square (downtown) take the MUNI <strong>M Ocean View</strong> or <strong>K Ingleside</strong> lines outbound to West Portal/Sloat/St Francis Station. Walk one block west to the park entrance at 19th Avenue and Sloat Boulevard. Then walk down the steep driveway to the clubhouse.
        </List.Item>
        <List.Item>
          <Header sub>Lyft, Uber, or Taxi</Header>
          Tell the driver you are going to the <strong>Sigmund Stern Recreation Grove</strong>, and that will get you to the entrance of Stern Grove on the northwest corner of 19th Avenue and Sloat Boulevard. Have the driver go all the way down the driveway to the clubhouse to drop you off.
        </List.Item>
        <List.Item>
          <Header sub>Drving/Parking</Header>
          We highly recommend using a different form of transportation, but there is a small parking lot immediately adjacent to the venue. If that lot fills up, we'll need to use the larger parking lot a short (and dark) walk away. See map above for parking lot location. There is also street parking along Sloat Blvd, which would require walking down into the park. For directions, use your favorite map application to get to the <strong>Sigmund Stern Recreation Grove</strong>.
        </List.Item>
      </List>
    ),
  }],
}, {
  name: 'trip',
  title: 'Your Trip',
  speed: '1.3',
  inMainPage: true,
  image: tripImage,
  sections: [{
    title: 'Accommodations',
    content: (
      <List>
        <List.Item>
          <Header sub>Our Hotel</Header>
          <List.List>
            <List.Item>
              The <a href="https://www.hotelabrisf.com/flink-sphar-wedding">Abri Hotel</a> near Union Square in downtown San Francisco. Our Group Code is <strong>11l2eq</strong>.
            </List.Item>
            <List.Item>
              <strong>UPDATE: Our room block has filled up quicker than we anticipated. If you would still like to stay at the Abri and get the discount, please <Link to="/home/contact">contact us</Link> directly so we can put in a special request to extend our block size.</strong>
            </List.Item>
            <List.Item>
              To contact the hotel: email <a href="mailto:abrreservations@metwesterra.com">abrreservations@metwesterra.com</a> or call <strong>888-229-0677</strong>.
            </List.Item>
          </List.List>
        </List.Item>
        <List.Item>
          <Header sub>Other options</Header>
          <List.List>
            <List.Item>
              Check out <a href="https://www.airbnb.com/s/San-Francisco--CA--United-States/all?refinement_paths%5B%5D=%2Ffor_you&source=p0&place_id=ChIJIQBpAG2ahYAR_6128GcTUEo&query=San%20Francisco%2C%20CA%2C%20United%20States&checkin=2018-09-07&checkout=2018-09-09">Airbnb</a>, <a href="https://www.vrbo.com/results?pets=false&q=San+Francisco%2C+CA%2C+USA&to-date=09%2F09%2F2018&children=0&from-date=09%2F07%2F2018&adults=0&uuid=">VRBO</a>, other hotels, and Bed & Breakfast options around the city.
            </List.Item>
            <List.Item>
              Downtown SF has many options.
            </List.Item>
            <List.Item>
              If you are looking for places around the venue, you will be further from most tourists attractions and hotels, but close to the beach.
            </List.Item>
            <List.Item>
              If you are not planning on spending much time in the city, staying near the SFO airport is convenient for getting to the venue and is a bit more cost efficient.
            </List.Item>
          </List.List>
        </List.Item>
        <List.Item>
          Please <Link to="/home/contact">contact us</Link> if you have any issues booking the Abri or would like more specific recommodations on where to stay!
        </List.Item>
      </List>
    ),
  }, {
    title: 'Transportation',
    content: (
      <List relaxed>
        <List.Item>
          <Header sub>Getting to San Francisco</Header>
          <List.List>
            <List.Item>
              San Francisco International Airport (SFO) and Oakland International Airports (OAK) are your two best options if you are flying. SFO is the closer airport, but both have easy access to downtown through public transportation (see below).
            </List.Item>
          </List.List>
        </List.Item>
        <List.Item>
          <Header sub>Note on renting a car</Header>
          <List.List>
            <List.Item>
              Driving and parking in the city is difficult with parking garage fees, street parking time limits, and car break-ins. Ride share services and public transportation are worth a shot if you are just planning on staying in the city. If you are planning on making trips outside of the city, you may want to consider renting a car for that portion of your trip.
            </List.Item>
          </List.List>
        </List.Item>
        <List.Item>
          <Header sub>Lyft, Uber, Taxis, and other ride shares</Header>
          <List.List>
            <List.Item>
              Between SFO aiport and downtown - from $20 to $40
            </List.Item>
            <List.Item>
              Within the city - anywhere from $6 to $20 (depending on how far you are going)
            </List.Item>
            <List.Item>
              Downtown to Stern Grove (the wedding venue) - about $20 to $25
            </List.Item>
            <List.Item>
              Prices above are based on Uber/Lyft approximations. They will be higher for the premium car options or during rush hours.
            </List.Item>
          </List.List>
        </List.Item>
        <List.Item>
          <Header sub>Public Transportaion</Header>
          <List.List>
            <List.Item>
              <a href="https://www.bart.gov/">BART</a> for getting to/from both airports and downtown San Francisco. Tickets are available at the BART stations and are about $10 each way per person (discounts available for children and seniors). Depending on your group size, taking lyft/uber may be better.
            </List.Item>
            <List.Item>
              <a href="https://www.sfmta.com/muni">MUNI</a> is best within San Francisco and even has a mobile app for paying fares. A typical fee for a one-way trip is $2.75. See the websites for schedules, routes, and all payment options.
            </List.Item>
          </List.List>
        </List.Item>
      </List>
    ),
  }],
}, {
  name: 'san-francisco',
  inMainPage: true,
  title: 'San Francisco',
  speed: '0.3',
  image: sfImage,
  imageStyle: { backgroundPosition: 'right' },
  sections: [{
    title: 'Visit',
    content: (
      <List relaxed>
        <List.Item>
          <Header sub>Downtown</Header>
          <List bulleted>
            <List.Item>
              <a href="https://www.ferrybuildingmarketplace.com/farmers-market/">The Ferry Building</a>: Large farmers market on Saturday mornings.
            </List.Item>
            <List.Item>
              <a href="http://www.cablecarmuseum.org/">The Cable Car Museum</a>: Free museum!
            </List.Item>
            <List.Item>
              <a href="https://en.wikipedia.org/wiki/Union_Square,_San_Francisco">Union Square</a>: Touristy area, but has lots of shops and restaurants nearby.
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <Header sub>Fisherman's Wharf/Russian Hill</Header>
          <List bulleted>
            <List.Item>
              <a href="https://www.ghirardellisq.com/">Ghiradelli Square</a>: Ice cream sundaes and chocolate.
            </List.Item>
            <List.Item>
              <a href="https://www.alcatrazcruises.com/tour-options/">Alcatraz</a>: Take a ferry out to this old prison island. Tickets sell out early, so get them a few weeks in advance.
            </List.Item>
            <List.Item>
              <a href="https://en.wikipedia.org/wiki/Lombard_Street_(San_Francisco)">Lombard Street</a>: The most crooked street in the world.
            </List.Item>
          </List>
        </List.Item>
        <List.Item>
          <Header sub>Presidio</Header>
          <List bulleted>
            <List.Item>
              <a href="http://www.goldengatebridge.org/">Golden Gate Bridge</a>: You've probably heard of it. If you are feeling ambitious, rent a bike in San Francisco, bike over the bridge to Sausalito for some food, and then take the ferry back to San Francisco.  </List.Item> <List.Item> <a href="https://www.nps.gov/goga/planyourvisit/cliff-house-sutro-baths.htm">Sutro Baths</a> / <a href="https://www.nps.gov/goga/planyourvisit/landsend.htm">Lands End</a>: Awesome ruins of an old indoor swimming pool and great views and walking paths.  </List.Item> <List.Item> <a href="https://www.nps.gov/prsf/planyourvisit/baker-beach.htm">Baker Beach</a>: Beach with a view of the bridge.  </List.Item> </List> </List.Item> <List.Item> <Header sub><a href="http://sfrecpark.org/parks-open-spaces/golden-gate-park-guide/">Golden Gate Park</a></Header> <Header as="h3"><Header.Subheader>Not to be confused with the bridge. This park is larger than NYC's Central Park. It has museums, hiking, buffalo, paddle boats, polo fields, and much more hidden all over it.</Header.Subheader></Header> </List.Item> <List.Item> <Header sub>Other Cool Places in SF</Header> <List bulleted> <List.Item> <a href="https://www.blueandgoldfleet.com/ferry/angel-island/">Angel Island</a>: An island in the middle of the bay, accessible by ferry, provides a few miles of hiking and good views.  </List.Item> <List.Item> <a href="http://sfrecpark.org/destination/twin-peaks/">Twin Peaks</a>: Spectacular views of the Bay Area as long as you are not in the fog!  </List.Item>
            <List.Item>
              <a href="https://www.nps.gov/goga/planyourvisit/oceanbeach.htm">Ocean Beach</a>: The beach at the end of Golden Gate Park. This is not a great beach for swimming or surfing, but walking and bonfires in the evenings is popular.
            </List.Item>
            <List.Item>
              Glen Canyon, Sutro Forest, Corona Heights: These are just a few of the many many parks that you can find to explore in the city.
            </List.Item>
          </List>
        </List.Item>
      </List>
    ),
  }, {
    title: 'Eat',
    content: (
      <List>
        <List.Item>
          <a href="https://www.yelp.com/biz/arsicault-bakery-san-francisco?adjust_creative=dWJMtmYxpd5N5yoyzSuhtA&utm_campaign=yelp_api&utm_medium=api_v2_business&utm_source=dWJMtmYxpd5N5yoyzSuhtA">Arsicault Bakery</a>: Our favorite crossaints.
        </List.Item>
        <List.Item>
          <a href="http://www.tartinebakery.com/">Tartine Bakery</a>: A famously delicious San Francisco bakery.
        </List.Item>
        <List.Item>
          <a href="http://biritecreamery.com/">BiRite Creamery</a>: Really delicious ice cream!
        </List.Item>
        <List.Item>
          <a href="https://elephantsushi.com/">Elephant Sushi</a>: Get the flaming sea bass and beware long lines.
        </List.Item>
        <List.Item>
          <a href="http://tonyspizzanapoletana.com/">Tony's Pizza Napoletana</a>: "The New Yorker is the best pizza ever." -John
        </List.Item>
        <List.Item>
          <a href="https://www.patxispizza.com/">Paxti Pizza</a>: We love the Matt Cain deep dish pizza.
        </List.Item>
        <List.Item>
          If you are looking for a good burrito, you have many options. These are just some of our favorites: <a href="http://www.thelittlechihuahua.com/">Little Chihuahua</a> (the Sweet Plantain and Black Bean Burrito is fantastic), <a href="https://www.yelp.com/biz/la-taqueria-san-francisco-2?adjust_creative=dWJMtmYxpd5N5yoyzSuhtA&utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=dWJMtmYxpd5N5yoyzSuhtA">La Taqueria</a>, <a href="http://tacorea.com/">Tacorea</a>.
        </List.Item>
      </List>
    ),
  }, {
    title: 'Drink',
    content: (
      <List>
        <List.Item>
          <a href="http://www.smugglerscovesf.com/">Smuggler's Cove</a>: Cool pirate and rum themed bar.
        </List.Item>
        <List.Item>
          <a href="http://www.bourbonandbranch.com/">Bourbon & Branch</a>: Recommended by our hotel.
        </List.Item>
        <List.Item>
          <a href="http://www.toronado.com/">Toronado</a>: Extensive selection of beer.
        </List.Item>
        <List.Item>
          <a href="https://www.ggtaproom.com/">Golden Gate Tap Room</a>: We will most likely be going here after the reception.
        </List.Item>
      </List>
    ),
  }, {
    title: 'Outside the City',
    description: 'The following are great places to visit, but will most likely require more time and a car to enjoy.',
    content: (
      <List>
        <List.Item>
          Marin Headlands, Sausalito, Muir Wood, Stinson Beach: All just north of the bridge.
        </List.Item>
        <List.Item>
          Halfmoon Bay: South of the city about 45 minutes.
        </List.Item>
        <List.Item>
          Berkeley and Oakland: A short car or BART ride east of SF.
        </List.Item>
        <List.Item>
          Napa and Sonoma (a.k.a Wine Country): About a 1.5 to 2 hour drive north-east.
        </List.Item>
        <List.Item>
          Monterey, Carmel, and Big Sur are about 3 hours south.
        </List.Item>
        <List.Item>
          Lake Tahoe: About 3.5 hours drive.
        </List.Item>
        <List.Item>
          Yosemite National Park: About 4.5 hours drive.
        </List.Item>
      </List>
    ),
  }],
}, {
  name: 'us',
  title: 'About Us',
  speed: '0.5',
  inMainPage: true,
  image: usImage,
  imagePort: usPortImage,
  sections: [{
    title: 'Our Story',
    content: (
      <div>
        We met through a phone dating app, Tinder, and bonded over our mutual interest in sci-fi literature. Our first date was on September 7, 2015. Since then, we have shared many adventures: hiking, golfing, cycling, programming, playing board games, traveling, living together, and more. We are excited to embark on our adventures to come as the Splink family!
      </div>
    ),
  }, {
    title: 'The Proposal',
    content: (
      <div>
        John planned a fun day of Christmas tree shopping, golf, and a gourmet french dinner (homemade from Julia Child's cookbook). Little did Amanda suspect that this day would be anything out of the ordinary until John brought out a vase full of roses and proposed. She said yes! And now we get to party!
      </div>
    ),
  }, {
    title: 'Fun Facts',
    content: (
      <List>
        <List.Item>
          We are going to combine our names: <em><strong>Sp</strong></em>har + F<em><strong>link</strong></em> = <em><strong>Splink</strong></em>.
        </List.Item>
        <List.Item>
          We are currently working together on a new startup!
        </List.Item>
        <List.Item>
          Our favorite ice cream flavor is chocolate peanut butter.
        </List.Item>
      </List>
    ),
  }],
}, {
  title: 'Contact Us',
  name: 'contact',
  speed: '0.8',
  inMainPage: true,
  component: Contact,
  image: contactImage,
}, {
  name: 'registry',
  title: 'Registry',
  hidden: true,
  sections: [{
    title: 'Thank you.',
    content: '',
  }],
}, {
  title: 'Frequently Asked Questions',
  name: 'faq',
  hidden: true,
  image: faqImage,
  imagePort: faqPortImage,
  sections: [{
    title: 'Question 1',
    content: 'Answer 1',
  }],
}, {
  name: 'wedding-party',
  title: 'Wedding Party',
  hidden: true,
  sections: [{
    title: 'Bride\'s attendants',
    content: '',
  }, {
    title: 'Groom\'s attendants',
    content: '',
  }, {
    title: 'Officiant',
    content: '',
  }],
}];

export default content;
