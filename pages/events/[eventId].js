import { Fragment } from 'react';
import Head from 'next/head';

import { getEventById, getFeaturedEvents } from '../../helpers/api-util';
import EventSummery from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import ErrorAlert from '../../components/ui/error-alert';
import Button from '../../components/ui/button';

function EventDetailPage(props) {
  const event = props.selectedEvent;

  if (!event) {
    return (
      <Fragment>
        <div className='center' >
          <p>Loading...</p>
        </div>
        {/* <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div> */}
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Head>
        <title>{event.title}</title>
        <meta name='description' content={event.description} />
      </Head>
      <EventSummery tittle={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const selectedEvent = await getEventById(eventId);

  return {
    props: {
      selectedEvent: selectedEvent
    },
    revalidate: 30 // regenarate every 30 sec
  }
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents();
  const paths = events.map(event => ({params: {eventId: event.id}}))

  return {
    paths: paths,
    fallback: 'blocking' //genereating the entire page first, then send it to the user
  }
}

export default EventDetailPage