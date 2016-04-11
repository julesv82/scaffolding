'use strict';

const allowedRoles = {
	newJoiner: 'newJoiner',
	itc:'itc',
  itcAdmin: 'itcAdmin',
  cfo: 'cfo',
  guest: 'guest',
  admin: 'admin'
};

const taskStatuses = {
  ADDITIONAL_TOOLS: {
    id: 'additional_tools',
    desc: 'Awaiting signed contract',
    image: '24_group.png',
    sortOrder: 1
  },
  APPROVAL: {
    id: 'approval',
    desc: 'Awaiting finance approval',
    image: '24_devices.png',
    sortOrder: 2
  },
  PROVISIONING: {
    id: 'provisioning',
    desc: 'Awaiting sourcing',
    image: '24_apps.png',
    sortOrder: 3
  },
  READY: {
    id: 'ready',
    desc: 'Ready to start',
    image: '24_calendar-alt.png',
    sortOrder: 4
  }
};

const toolTypes = {
  DEVICE: {
    id: 'device',
    name: 'Device',
    image: '24_devices.png'
  },
  APPLICATION: {
    id: 'application',
    name: 'Application',
    image: '24_apps.png'
  }
};

const sortableTaskFields = {
  newJoiner: 'assignee.name',
  status: 'status',
  completion: 'completion',
  slaCode: 'slaCode',
  startDate: 'assignee.startDate'
};

const tasksColumns = [
  {
    id: 'newJoinerCol',
    title: 'New joiner',
    width: 4,
    sort: {
      field: sortableTaskFields.newJoiner
    },
    secondarySortFields: [
      { field: sortableTaskFields.slaCode },
      { field: sortableTaskFields.startDate, descending: true },
      { field: sortableTaskFields.completion }
    ]
  },
  {
    id: 'statusCol',
    title: 'Status',
    width: 2,
    sort: {
      field: sortableTaskFields.status
    },
    secondarySortFields: [
      { field: sortableTaskFields.newJoiner },
      { field: sortableTaskFields.slaCode },
      { field: sortableTaskFields.startDate, descending: true }
    ]
  },
  {
    id: 'completionCol',
    title: 'Completion',
    width: 2,
    sort: {
      field: sortableTaskFields.completion
    },
    secondarySortFields: [
      { field: sortableTaskFields.newJoiner },
      { field: sortableTaskFields.slaCode },
      { field: sortableTaskFields.startDate, descending: true }
    ]
  },
  {
    id: 'slaCodeCol',
    title: 'SLA code',
    width: 2,
    sort: {
      field: sortableTaskFields.slaCode
    },
    secondarySortFields: [
      { field: sortableTaskFields.newJoiner },
      { field: sortableTaskFields.completion },
      { field: sortableTaskFields.startDate, descending: true }
    ]
  },
  {
    id: 'startDateCol',
    title: 'Start date',
    width: 2,
    sort: {
      field: sortableTaskFields.startDate,
      defaultDescending: true
    },
    secondarySortFields: [
      { field: sortableTaskFields.newJoiner },
      { field: sortableTaskFields.slaCode },
      { field: sortableTaskFields.completion }
    ]
  }
];

const defaults = {
  tasksSortBy:
    [sortableTaskFields.newJoiner, sortableTaskFields.slaCode, '-' + sortableTaskFields.startDate].join(),
  daysInTimeLine: 14,
  showTestUsers: process.env.NODE_ENV !== 'production'
};

module.exports = {
	allowedRoles: allowedRoles,
  taskStatuses: taskStatuses,
  toolTypes: toolTypes,
  tasksColumns: tasksColumns,
  defaults: defaults
};
