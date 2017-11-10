import {
  REGISTER_USER, REGISTER_USER_ERROR, VERIFIED_USER,
  NETWORK_UNAVAILABLE, ADD_NEW_TIP,
  SEND_TIP, SEND_TIP_SUCCESS, SEND_TIP_ERROR, SET_ACTIVE_TAB,
  GET_TIPS, GET_TIPS_SUCCESS, GET_TIPS_ERROR, CHANGE_VIEW,
  CLEAR_PENDING, CONNECT_AGAIN, CONNECT_AGAIN_SUCCESS, CONNECT_AGAIN_ERROR,
  BUY_GOLD, BUY_GOLD_SUCCESS, BUY_GOLD_ERROR, GET_GOLD, GET_GOLD_ERROR,
  GET_GOLD_SUCCESS, ADD_NEW_GOLD, SET_DISCONNECTED, SET_REFUND_TIPS
} from '../../../constants/actionTypes';
import { NETWORK_URL, TABS, VIEWS } from '../../../constants/general';

export const reducerName = 'user';

// Registering is the state while he sends data to the contract
// Verifying is when he is waiting for a response from Oreclize

const INITIAL_STATE = {
  networkActive: true,
  acceptedNotice: false,
  registering: false,
  registeringError: '',
  verified: false,
  verifiedUsername: '',
  registeringUsername: '',
  networkUrl: NETWORK_URL,
  sendingTip: false,
  sendingTipError: '',
  refundTipIndex: '',
  refundTipUsername: '',
  activeTab: TABS[0].slug,
  gettingTips: false,
  gettingTipsError: '',
  tips: [],
  view: VIEWS[0],
  connectingAgain: false,
  connectingAgainError: '',
  buyingGold: false,
  buyingGoldError: '',
  golds: [],
  gettingGold: false,
  gettingGoldError: '',
  disconnected: false
};

export const reducer = (state, action) => {
  const payload = action.payload;

  switch (action.type) {
    case `${CLEAR_PENDING}-${reducerName}`:
      return {
        ...state,
        sendingTip: false,
        sendingTipError: '',
        gettingSentTips: false,
        gettingSentTipsError: '',
        gettingTips: false,
        gettingTipsError: '',
        buyingGold: false,
        buyingGoldError: '',
        connectingAgain: false,
        connectingAgainError: '',
      };

    case REGISTER_USER:
      return {
        ...state,
        registering: true,
        registeringUsername: payload.username,
        registeringError: ''
      };
    case VERIFIED_USER:
      return {
        ...state,
        registering: false,
        verified: true,
        registeringUsername: '',
        verifiedUsername: state.registeringUsername,
      };

    case REGISTER_USER_ERROR:
      return {
        ...state,
        registering: false,
        registeringError: 'An error occurred while registering your username, please try again.'
      };

    case SET_ACTIVE_TAB:
      return { ...state, activeTab: payload };

    case NETWORK_UNAVAILABLE:
      return { ...state, networkActive: false };

    case SEND_TIP:
      return { ...state, sendingTip: true };
    case SEND_TIP_SUCCESS:
      return { ...state, sendingTip: false, sendingTipError: '' };
    case SEND_TIP_ERROR:
      return {
        ...state,
        sendingTip: false,
        sendingTipError: 'An error occurred while sending tip, please try again.'
      };

    case GET_TIPS:
      return { ...state, gettingTips: true };
    case GET_TIPS_SUCCESS:
      return {
        ...state,
        tips: payload,
        gettingTips: false,
        gettingTipsError: ''
      };
    case GET_TIPS_ERROR:
      return {
        ...state,
        gettingTips: false,
        gettingTipsError: 'An error occurred while getting tips, please try again.'
      };
    case ADD_NEW_TIP: {
      const tips = [...state.tips];
      const tip = payload.tip;

      if (tip.from === payload.address) {
        const sentTip = Object.assign({}, tip);
        sentTip.type = 'sent';
        tips.unshift(sentTip);
      }

      if (tip.to === payload.username) {
        const receivedTip = Object.assign({}, tip);
        receivedTip.type = 'received';
        tips.unshift(receivedTip);
      }

      return { ...state, tips };
    }

    case GET_GOLD:
      return { ...state, gettingGold: true };
    case GET_GOLD_SUCCESS:
      return {
        ...state,
        golds: payload,
        gettingGold: false,
        gettingGoldError: ''
      };
    case GET_GOLD_ERROR:
      return {
        ...state,
        gettingGold: false,
        gettingGoldError: 'An error occurred while getting gold, please try again.'
      };
    case ADD_NEW_GOLD: {
      const golds = [...state.golds];
      const gold = payload.gold;

      if (gold.from === payload.address) {
        const sentGold = Object.assign({}, gold);
        sentGold.type = 'sent';
        golds.unshift(sentGold);
      }

      if (gold.to === payload.username) {
        const receivedGold = Object.assign({}, gold);
        receivedGold.type = 'received';
        golds.unshift(receivedGold);
      }

      return { ...state, golds };
    }

    case CHANGE_VIEW:
      return { ...state, view: payload.viewName, ...payload.additionalChanges };

    case CONNECT_AGAIN:
      return { ...state, connectingAgain: true };
    case CONNECT_AGAIN_SUCCESS:
      return { ...state, connectingAgain: false, connectingAgainError: '' };
    case CONNECT_AGAIN_ERROR:
      return {
        ...state,
        connectingAgain: false,
        connectingAgainError: 'Still could not connect, please try again.'
      };

    case BUY_GOLD:
      return { ...state, buyingGold: true };
    case BUY_GOLD_SUCCESS:
      return { ...state, buyingGold: false, buyingGoldError: '' };
    case BUY_GOLD_ERROR:
      return {
        ...state,
        buyingGold: false,
        buyingGoldError: 'An error occurred while buying gold, please try again.'
      };

    case SET_DISCONNECTED:
      return { ...state, disconnected: payload };

    case SET_REFUND_TIPS:
      return { ...state, tips: payload };

    default:
      return false;
  }
};

export const data = {
  name: reducerName,
  initialState: INITIAL_STATE,
  handle: reducer
};
