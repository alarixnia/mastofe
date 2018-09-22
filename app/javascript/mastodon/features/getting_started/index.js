import React from 'react';
import Column from '../ui/components/column';
import ColumnLink from '../ui/components/column_link';
import ColumnSubheading from '../ui/components/column_subheading';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { me, invitesEnabled } from '../../initial_state';
import { fetchFollowRequests } from '../../actions/accounts';
import { fetchPanel, fetchPleromaConfig } from '../../actions/pleroma';
import { List as ImmutableList } from 'immutable';
import { Link } from 'react-router-dom';
import NavigationBar from '../compose/components/navigation_bar';

const messages = defineMessages({
  home_timeline: { id: 'tabs_bar.home', defaultMessage: 'Home' },
  notifications: { id: 'tabs_bar.notifications', defaultMessage: 'Notifications' },
  public_timeline: { id: 'navigation_bar.public_timeline', defaultMessage: 'Federated timeline' },
  settings_subheading: { id: 'column_subheading.settings', defaultMessage: 'Settings' },
  community_timeline: { id: 'navigation_bar.community_timeline', defaultMessage: 'Local timeline' },
  direct: { id: 'navigation_bar.direct', defaultMessage: 'Direct messages' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  follow_requests: { id: 'navigation_bar.follow_requests', defaultMessage: 'Follow requests' },
  favourites: { id: 'navigation_bar.favourites', defaultMessage: 'Favourites' },
  blocks: { id: 'navigation_bar.blocks', defaultMessage: 'Blocked users' },
  domain_blocks: { id: 'navigation_bar.domain_blocks', defaultMessage: 'Hidden domains' },
  mutes: { id: 'navigation_bar.mutes', defaultMessage: 'Muted users' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned toots' },
  lists: { id: 'navigation_bar.lists', defaultMessage: 'Lists' },
  discover: { id: 'navigation_bar.discover', defaultMessage: 'Discover' },
  personal: { id: 'navigation_bar.personal', defaultMessage: 'Personal' },
  security: { id: 'navigation_bar.security', defaultMessage: 'Security' },
  menu: { id: 'getting_started.heading', defaultMessage: 'Getting started' },
});

const mapStateToProps = state => ({
  myAccount: state.getIn(['accounts', me]),
  unreadFollowRequests: state.getIn(['user_lists', 'follow_requests', 'items'], ImmutableList()).size,
  customPanelEnabled: state.getIn(['custom_panel', 'enabled']),
  customPanel: state.getIn(['custom_panel', 'panel']),
});

const mapDispatchToProps = dispatch => ({
  fetchFollowRequests: () => dispatch(fetchFollowRequests()),
  fetchPanel: () => dispatch(fetchPanel()),
  fetchPleromaConfig: () => dispatch(fetchPleromaConfig()),
});

const badgeDisplay = (number, limit) => {
  if (number === 0) {
    return undefined;
  } else if (limit && number >= limit) {
    return `${limit}+`;
  } else {
    return number;
  }
};

@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
export default class GettingStarted extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    myAccount: ImmutablePropTypes.map.isRequired,
    columns: ImmutablePropTypes.list,
    multiColumn: PropTypes.bool,
    fetchFollowRequests: PropTypes.func.isRequired,
    fetchPanel: PropTypes.func.isRequired,
    fetchPleromaConfig: PropTypes.func.isRequired,
    unreadFollowRequests: PropTypes.number,
    unreadNotifications: PropTypes.number,
    customPanelEnabled: PropTypes.bool,
    customPanel: PropTypes.string.isRequired,
  };

  componentDidMount () {
    const { myAccount, fetchFollowRequests, fetchPleromaConfig, fetchPanel } = this.props;

    if (myAccount.get('locked')) {
      fetchFollowRequests();
    }

    fetchPleromaConfig();
    fetchPanel();
  }

  render () {
    const { intl, myAccount, multiColumn, unreadFollowRequests, customPanelEnabled, customPanel } = this.props;

    const navItems = [];
    let i = 1;
    let height = (multiColumn) ? 0 : 60;

    if (multiColumn) {
      navItems.push(
        <ColumnSubheading key={i++} text={intl.formatMessage(messages.discover)} />,
        <ColumnLink key={i++} icon='users' text={intl.formatMessage(messages.community_timeline)} to='/timelines/public/local' />,
        <ColumnLink key={i++} icon='globe' text={intl.formatMessage(messages.public_timeline)} to='/timelines/public' />,
        <ColumnSubheading key={i++} text={intl.formatMessage(messages.personal)} />
      );

      height += 34*2 + 48*2;
    }

    navItems.push(
      <ColumnLink key={i++} icon='envelope' text={intl.formatMessage(messages.direct)} to='/timelines/direct' />,
      <ColumnLink key={i++} icon='star' text={intl.formatMessage(messages.favourites)} to='/favourites' />,
      <ColumnLink key={i++} icon='list-ul' text={intl.formatMessage(messages.lists)} to='/lists' />
    );

    height += 48*3;

    if (myAccount.get('locked')) {
      navItems.push(<ColumnLink key={i++} icon='users' text={intl.formatMessage(messages.follow_requests)} badge={badgeDisplay(unreadFollowRequests, 40)} to='/follow_requests' />);
      height += 48;
    }

    if (!multiColumn) {
      navItems.push(
        <ColumnSubheading key={i++} text={intl.formatMessage(messages.settings_subheading)} />,
        <ColumnLink key={i++} icon='gears' text={intl.formatMessage(messages.preferences)} href='/user-settings' />,
      );

      height += 34 + 48;
    }

    const dot = ' • ';
    const staticContent = (customPanelEnabled ? <div dangerouslySetInnerHTML={{__html: customPanel}} style={{marginLeft: -12, marginRight: -12}} /> :
      <p>
        <a href='https://github.com/tootsuite/documentation/blob/master/Using-Mastodon/FAQ.md' rel='noopener' target='_blank'><FormattedMessage id='getting_started.faq' defaultMessage='FAQ' /></a>
        {dot}
        <a href='https://github.com/tootsuite/documentation/blob/master/Using-Mastodon/User-guide.md' rel='noopener' target='_blank'><FormattedMessage id='getting_started.userguide' defaultMessage='User Guide' /></a>
        {dot}
        <a href='https://github.com/tootsuite/documentation/blob/master/Using-Mastodon/Apps.md' rel='noopener' target='_blank'><FormattedMessage id='getting_started.appsshort' defaultMessage='Apps' /></a>
        {dot}
        <a href='https://pleroma.social'><FormattedMessage id='getting_started.pleroma' defaultMessage='Pleroma' /></a>
      </p>
    );

    return (
      <Column label={intl.formatMessage(messages.menu)}>
        {multiColumn && <div className='column-header__wrapper'>
          <h1 className='column-header'>
            <button>
              <i className='fa fa-bars fa-fw column-header__icon' />
              <FormattedMessage id='getting_started.heading' defaultMessage='Getting started' />
            </button>
          </h1>
        </div>}

        <div className='getting-started__wrapper scrollable' style={{ height }}>
          {!multiColumn && <NavigationBar account={myAccount} />}
          {navItems}
        </div>

        {!multiColumn && <div className='flex-spacer' />}

        <div className='getting-started getting-started__panel scrollable'>
          {staticContent}
        </div>

        {!multiColumn && <div className='flex-spacer' />}

        <div className='getting-started__footer scrollable'>
          <ul>
            {invitesEnabled && <li><a href='/invites' target='_blank'><FormattedMessage id='getting_started.invite' defaultMessage='Invite people' /></a> · </li>}
            {multiColumn && <li><Link to='/keyboard-shortcuts'><FormattedMessage id='navigation_bar.keyboard_shortcuts' defaultMessage='Hotkeys' /></Link> · </li>}
            <li><a href='/auth/sign_out' data-method='delete'><FormattedMessage id='navigation_bar.logout' defaultMessage='Logout' /></a></li>
          </ul>
          <p>
            <FormattedMessage
              id='getting_started.mastofe_notice'
              defaultMessage='{mastofe} is libre software based on {mastodon} frontend adapted for {pleroma}.'
              values={{
                mastofe: <a href='https://git.pleroma.social/pleroma/mastofe' rel='noopener' target='_blank'>Mastofe</a>,
                mastodon: <a href='https://github.com/tootsuite/mastodon' rel='noopener' target='_blank'>Mastodon</a>,
                pleroma: <a href='https://pleroma.social' rel='noopener' target='_blank'>Pleroma</a>
              }}
            />
          </p>
        </div>
      </Column>
    );
  }

}
