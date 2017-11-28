const fxn = ticket => ({
  username: 'zenbot',
  icon_url: 'http://garden.zendesk.com/favicons/zendesk/apple-touch-icon.png',
  channel: ticket.slack_channel,
  text: `Ticket #${ticket.id} from _${ticket.requester}_`,
  attachments: [
    {
      callback_id: `callbackid_${ticket.id}`,
      color: '#78a300',
      title: `<https://${ticket.url}|${ticket.title}>`,
      text: `${ticket.latest_comment} \n`,
      fields: [
        {
          title: "Priority",
          value: ticket.priority,
          short: true
        },
        {
          title: "Type",
          value: ticket.type,
          short: true
        },
        {
          title: "Assigned Group",
          value: ticket.assigned_group,
          short: true
        }
      ],
      actions: [
        {
          name: 'edit_ticket',
          text: 'Edit Ticket',
          type: 'button',
          value: 'edit_ticket'
        },
        {
          name: 'Status',
          text: 'Status',
          type: 'select',
          options: [
            {
              text: 'New',
              value: 'New'
            },
            {
              text: 'Open',
              value: 'Open'
            },
            {
              text: 'Pending',
              value: 'Pending'
            },
            {
              text: 'Solved',
              value: 'Solved'
            }
          ],
          selected_options: [
            {
              text: ticket.status,
              value: ticket.status
            }
          ]
        }
      ]
    }
  ]
});

module.exports = fxn;
