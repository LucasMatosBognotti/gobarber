import React, { useState, useEffect, useMemo } from 'react';
import { MdNotifications } from 'react-icons/md';
import { parseISO, formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';

import { Container, Badge, NotificationList, Scroll, Notification } from './styles';

export default function notifications() {
  
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [visible, setVisible] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [notifications, setNotifications] = useState([]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hasUnread = useMemo(
    () => !!notifications.find(notification => notification.read === false),
    [notifications]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    async function loadNotifications() {
      const response = await api.get('notifications');
      //console.log(response);

      const data = response.data.map(notification => ({
        ...notification,
        timeDistance: formatDistance(
          parseISO(notification.createdAt),
          new Date(),
          { addSuffix: true, locale: pt }
        ),
      }));

      setNotifications(data);
    }

    loadNotifications();
  }, []);

  function handleToggleVisible() {
    setVisible(!visible);
  }

  async function handleMarkAsRead(id) {
    await api.put(`notifications/${id}`);

    setNotifications(
      notifications.map(notification => 
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }

  return(
    <Container>
      <Badge onClick={handleToggleVisible} hasUnread={hasUnread}>
        <MdNotifications color="#7159c1" size={20} />
      </Badge>

      <NotificationList visible={visible}>
        <Scroll> 
          { notifications.map(notification => (
            <Notification key={notification._id} unread={!notification.read}>
              <p>{notification.content}</p>
              <time>{notification.timeDistance}</time>
              { !notification.read && (<button type="button" onClick={() => handleMarkAsRead(notification._id)} >Marcar como lida</button>)}
          </Notification>
          )) }
        </Scroll>
      </NotificationList>
    </Container>
  );
}