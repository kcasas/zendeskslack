const fxn = groups => ({
  title: 'Create new Ticket',
  callback_id: 'omgmyfirstdialog',
  elements: [
    {
      type: 'text',
      label: 'Title',
      name: 'title'
    },
    {
      type: 'textarea',
      label: 'Description',
      name: 'description'
    },
    {
      type: 'select',
      label: 'Assign to Group',
      name: 'assignee',
      options: groups.map(group => ({ label: group.name, value: group.id }))
    },
    {
      type: 'select',
      label: 'Priority',
      name: 'priority',
      options: [
        {
          label: 'Urgent',
          value: 'urgent'
        },
        {
          label: 'High',
          value: 'high'
        },
        {
          label: 'Normal',
          value: 'normal'
        },
        {
          label: 'Low',
          value: 'low'
        }
      ]
    },
    {
      type: 'select',
      label: 'Type',
      name: 'type',
      options: [
        {
          label: 'Problem',
          value: 'problem'
        },
        {
          label: 'Incident',
          value: 'incident'
        },
        {
          label: 'Question',
          value: 'question'
        },
        {
          label: 'Task',
          value: 'task'
        }
      ]
    }
  ]
});


module.exports = fxn;
