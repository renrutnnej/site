/* eslint react/prop-types: 0 */
import ReactHTMLEmail, {Email, Box, Item, Image, A, renderEmail} from 'react-html-email'

import {copy} from 'copy-paste'
import striptags from 'striptags'
// import marked from 'marked'
// import deindent from 'deindent'

import {getSponsorsForDate} from '../sponsors'

// import * as utils from '<utils>/utils'
import {episodes} from '../episodes'
// import episodeList from './utils/episode-list'
// import inquirer from 'inquirer'

hijackConsole()

ReactHTMLEmail.injectReactEmailAttributes()
renderAndCopy(episodes[24])
// inquirer.prompt([
//   episodeList,
// ]).then(({episode}) => {
//   renderAndCopy(episode)
// })

function renderAndCopy(episode) {
  const showSponsors = getSponsorsForDate(episode.date)
  const string = renderEmail(
    <EpisodeEmail
      episode={episode}
      sponsors={showSponsors}
    />
  )

  copy(string, err => {
    if (err) {
      throw err
    }
    console.log(`Podcast email for "${episode.title}" copied to your clipboard`)
  })
}

function EpisodeEmail({episode, sponsors}) {
  const {
    // date,
    titleHTML,
    descriptionHTML,
    number,
    // guests,
    // host,
    // panelists,
  } = episode
  const title = striptags(titleHTML.__html)
  const episodePage = `https://javascriptair.com${episode.page}`
  // const panelistsAndHost = utils.sortPeople([...panelists, host])
  // const showAttendees = [...utils.sortPeople(guests), ...panelistsAndHost]
  const combinedSponsors = [sponsors.premierSponsor, ...sponsors.goldSponsors, ...sponsors.silverSponsors]
  const headCSS = getHeadCSS()

  return (
    <Email
      title={title}
      headCSS={headCSS}
      style={{backgroundColor: 'white'}}
    >
      <Banner page={episodePage} />
      <Item align="center">
        <WatchShowButton page={episodePage} />
        <ShowImage />
        <Description descriptionHTML={descriptionHTML} />
        <ClickButtonWithAudioOption page={episodePage} number={number} />
        <SponsorsSection sponsors={combinedSponsors} />
      </Item>
    </Email>
  )
}

function getHeadCSS() {
  return `
    table {
      font-family: Helvetica;
    }
    a, a:hover, a:active, a:focus {
      color: #2BAADF;
      text-decoration: none;
    }
  `
}

function Banner({page}) {
  const link = `${page}#email`
  const textColor = '#656565'
  const styles = {
    item: {
      paddingBottom: 9,
      msoLineHeightRule: 'exactly',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      wordBreak: 'break-word',
      fontFamily: 'Helvetica',
      textAlign: 'center',
    },
    div: {
      display: 'inline-block',
      width: 300,
    },
    p: {
      color: textColor,
      fontSize: '12px',
      lineHeight: '150%',
      display: 'inline',
    },
    a: {
      color: textColor,
    },
  }
  return (
    <Item align="center">
      <Box width="100%">
        <Item style={styles.item}>
          <div style={{...styles.div, textAlign: 'left'}}>
            <p style={styles.p}>
              The live broadcast podcast all about JavaScript.
            </p>
          </div>
          <div style={{...styles.div, textAlign: 'right'}}>
            <p style={styles.p}>
              <A href={link} style={styles.a}>
                View this email in your browser
              </A>
            </p>
          </div>
        </Item>
      </Box>
      <Logo />
    </Item>
  )
}

function Logo() {
  return (
    <A href="https://javascriptair.com">
      <Image
        src="https://gallery.mailchimp.com/b94b1e66eec3edf77e4740a5e/images/25b3b086-1d69-44cf-a6dc-3e7cb6616299.png" // eslint-disable-line
        width={600}
        height={166}
        alt="JavaScript Air Logo"
      />
    </A>
  )
}

function WatchShowButton({page}) {
  const styles = {
    box: {
      borderCollapse: 'separate !important',
      borderRadius: '3px',
      backgroundColor: '#AAAAAA',
      msoTableLspace: '0pt',
      msoTableRspace: '0pt',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      marginTop: 24,
    },
    p: {
      lineHeight: '100%',
      fontSize: '16px',
      padding: '15px',
      margin: 0,
    },
    a: {
      fontWeight: 'bold',
      letterSpacing: 'normal',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#FFFFFF',
      msoLineHeightRule: 'exactly',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      display: 'block',
    },
  }
  return (
    <Box style={styles.box} align="center">
      <Item>
        <p style={styles.p}>
          <A
            href={page}
            style={styles.a}
          >
            Watch the latest episode now
          </A>
        </p>
      </Item>
    </Box>
  )
}

function ShowImage() {
  return (
    <Box>
      <Item>
        <Image
          width={600}
          height={300}
          src="https://gallery.mailchimp.com/b94b1e66eec3edf77e4740a5e/images/3652340e-2b32-463f-8212-fb68796c8797.png"
          alt="Show image"
        />
      </Item>
    </Box>
  )
}

function Description({descriptionHTML}) {
  const styles = {
    h1: {
      display: 'block',
      margin: 0,
      padding: 0,
      color: '#202020',
      fontFamily: 'Helvetica',
      fontSize: '26px',
      fontStyle: 'normal',
      fontWeight: 'bold',
      lineHeight: '125%',
      letterSpacing: 'normal',
      textAlign: 'left',
    },
    p: {
      margin: '10px 0',
      padding: 0,
      msoLineHeightRule: 'exactly',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      color: '#202020',
      fontFamily: 'Helvetica',
      fontSize: '16px',
      lineHeight: '150%',
      textAlign: 'left',
    },
  }
  return (
    <div>
      <h1 style={styles.h1}>Hello JavaScript Air friends!</h1>
      <div style={styles.p} dangerouslySetInnerHTML={descriptionHTML} />
    </div>
  )
}

function ClickButtonWithAudioOption({page, number}) {
  const styles = {
    p: {
      fontSize: 16,
      margin: 0,
      marginTop: 16,
      lineHeight: '100%',
      display: 'inline-block',
    },
    a: {
      fontWeight: 'bold',
      padding: '15px',
      letterSpacing: 'normal',
      textAlign: 'center',
      textDecoration: 'none',
      color: '#FFFFFF',
      msoLineHeightRule: 'exactly',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      display: 'block',
      borderCollapse: 'separate !important',
      borderRadius: '3px',
      backgroundColor: '#2BAADF',
      msoTableLspace: '0pt',
      msoTableRspace: '0pt',
    },
  }
  return (
    <p style={styles.p}>
      <A
        href={page}
        style={styles.a}
      >
        Click for more about Episode {number}, including an audio option
      </A>
    </p>
  )
}

function SponsorsSection({sponsors}) {
  const styles = {
    box: {
      minWidth: '100%',
      border: '2px solid #222222',
      borderCollapse: 'collapse',
      msoTableLspace: '0pt',
      msoTableRspace: '0pt',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      marginTop: 40,
    },
    item: {
      fontFamily: 'Helvetica',
      fontSize: '14px',
      fontWeight: 'normal',
      textAlign: 'left',
      msoLineHeightRule: 'exactly',
      msTextSizeAdjust: '100%',
      WebkitTextSizeAdjust: '100%',
      wordBreak: 'break-word',
      color: '#202020',
      lineHeight: '150%',
      padding: 18,
    },
    h2: {
      marginTop: 0,
    },
  }
  return (
    <Box style={styles.box}>
      <Item style={styles.item}>
        <h2 style={styles.h2}>This episode made possible by</h2>
        <ul>
          {
            sponsors.map(({name, link, tagline}, i) => (
              <li key={i}>
                <A href={link} textDecoration="none">{name}</A> - {tagline}
              </li>
            ))
          }
        </ul>
      </Item>
    </Box>
  )
}

function hijackConsole() {
  const ignoreLogs = [
    'in outlook:',
    'unsupported in: outlook.',
    'mso-line-height-rule',
    'border-radius` supplied to `Box` unsupported in',
  ]
  hijack('warn')
  hijack('error')

  function hijack(logger) {
    const original = console[logger]
    console[logger] = function hijackedConsole(...args) {
      const line = args.join(' ')
      const shouldIgnore = ignoreLogs.some(l => line.includes(l))
      if (!shouldIgnore) {
        return original(...args)
      }
      return undefined
    }
  }
}
