import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import getVideoId from 'get-video-id'
import myConfiguredSanityClient from 'part:@sanity/base/client'

const {
  projectId,
  dataset
} = myConfiguredSanityClient.clientConfig

export default class YoutubeVideo extends Component {
    static propTypes = {
      value: PropTypes.object
    }

    getEmbedCode(value) {
      if (!value) {return null}

      if (value.file) {
        const {
          asset: { _ref = ''} = {}
        } = value.file
        if(!_ref) {return <div></div>}
        const fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${_ref.split('-')[1]}.${_ref.split('-')[2]}`
            return (<video style = {
                {
                    width: '100%',
                    display: 'block'
                }
            }
            src = {
                fileUrl
            }
            />)
      }
      const videoId = (value && value.url) ? getVideoId(value.url) : ''

      if (!videoId) {
        return <span />
      }

      switch (videoId.service) {
        case 'youtube':
        {
          return (<iframe src = {
                        `https://www.youtube.com/embed/${videoId.id}?rel=0`
                    }
                    frameBorder = "0"
                    allowFullScreen / >)
        }

        case 'vimeo':
        {
          return (<iframe src ={
              `https://player.vimeo.com/video/${videoId.id}`
            }
            width= "640"
            frameBorder ="0"
                      webkitallowfullscreen mozallowfullscreen allowFullScreen
                             />
          )
        }
        default:
        {
          return (<span > Unsupported video service: {
                        videoId.service
                    } < /span>)
        }
      }
    }
    render() {
      const {
        value
      } = this.props
      return (<div style= {
          {
            minHeight: '2em'
          }
        }
                 > {
          this.getEmbedCode(value)
        }
                 </div>
      )
    }
}
