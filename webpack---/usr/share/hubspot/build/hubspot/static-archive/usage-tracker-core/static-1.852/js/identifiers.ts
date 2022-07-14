import { accountId } from './storageKeys';
import { eventError } from './common/messages';

const resolveUserAndTeamIdentifiers = ({
  deviceId,
  utk,
  email,
  hubId
}, {
  allowUnauthed,
  isExternalHost
}) => {
  let anon;
  let user;
  let team;

  if (hubId) {
    team = hubId;
  }

  if (email) {
    user = `EMAIL:::${email}:::${accountId}`;
  } else if (utk) {
    if (isExternalHost) {
      anon = `TEMP_ID:::${utk}:::${accountId}`;
    } else {
      anon = `VISITOR:::${utk}:::${accountId}`;
    }
  } else if (deviceId) {
    anon = `TEMP_ID:::${deviceId}:::${accountId}`;
  }

  if (!anon && !user) {
    throw eventError('Could not identify user. Please specify either an email address or __hstc cookie identifer.');
  }

  if (!allowUnauthed) {
    if (!user) {
      throw eventError('Could not identify user. Please specify an email address.');
    }

    if (!team) {
      throw eventError('Could not identify hub. Please specify a hubId.');
    }
  }

  return {
    user: user || anon,
    team
  };
};

const parseUtk = hstc => {
  let utk;

  if (hstc) {
    const hstcParts = hstc.split('.');

    if (hstcParts.length > 1) {
      utk = hstcParts[1];
    }
  }

  return utk;
};

export const createIdentifiers = ({
  email,
  userId,
  hubId,
  hstc,
  deviceId
}, {
  allowUnauthed,
  isExternalHost
}) => {
  const utk = parseUtk(hstc);
  const {
    user,
    team
  } = resolveUserAndTeamIdentifiers({
    deviceId,
    utk,
    email,
    hubId
  }, {
    allowUnauthed,
    isExternalHost
  });
  return {
    user,
    team,
    utk,
    raw: {
      email,
      userId,
      hubId,
      hstc,
      deviceId
    }
  };
};