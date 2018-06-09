import React, { Fragment } from 'react'
import imageUrlBuilder from '@sanity/image-url'
import myConfiguredSanityClient from 'part:@sanity/base/client'
const builder = imageUrlBuilder(myConfiguredSanityClient)
function urlFor (source) {
  return builder.image(source)
}
const bgColor = ({ color = {} }) => color.hex || '#fff'
const fgColor = ({ color = {} }) =>
  color.hex ? invertColor(color.hex) : '#000'
const SlidePreview = ({ background, mediaUrl, title }) => (
  <div
    style={{
      backgroundColor: bgColor(background),
      color: fgColor(background),
      minHeight: '100%',
      minWidth: '100%'
    }}
  >
    {mediaUrl ? (
      <Fragment>
        <img src={mediaUrl} />
        <div
          style={{ marginLeft: '5em', marginBottom: '2em', fontSize: '9px' }}
        >
          {title}
        </div>
      </Fragment>
    ) : (
      <span>{title}</span>
    )}
  </div>
)

export default {
  name: 'slide',
  type: 'object',
  title: 'Slide',
  fields: [
    {
      name: 'title',
      title: 'Slide title',
      type: 'string'
    },
    {
      name: 'background',
      type: 'object',
      fields: [
        {
          name: 'image',
          type: 'image',
          options: {
            hotSpot: true
          }
        },
        {
          name: 'color',
          title: 'Slide color',
          type: 'color'
        }
      ]
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                title: 'Fragment',
                name: 'fragment',
                type: 'object',
                fields: [
                  {
                    name: 'type',
                    title: 'Fragment type',
                    description: 'Fragments lets you animate parts of your slide. Not supported in all frontends.',
                    type: 'string',
                    options: {
                      list: [
                        { value: 'grow', title: 'Grow' },
                        { value: 'shrink', title: 'Shrink' },
                        { value: 'fade-out', title: 'Fade out' },
                        { value: 'fade-up', title: 'Fade up' },
                        { value: 'current-visible', title: 'Current visible' },
                        {
                          value: 'highlight-current-blue',
                          title: 'Highlight current blue'
                        },
                        { value: 'highlight-red', title: 'Highlight red' },
                        { value: 'highlight-green', title: 'Highlight green' },
                        { value: 'highlight-blue', title: 'Highlight blue' }
                      ]
                    }
                  }
                ]
              },
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'video'
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'notes',
      title: 'Presenter\’s notes',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block'
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    },
    {
      name: 'transitions',
      title: 'Transitions',
      description: 'Transition animation for slide. Some frontends support multiple.',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { value: 'zoom', title: 'Zooom' },
              { value: 'fast', title: 'Fast' },
              { value: 'slide', title: 'Slide' },
              { value: 'slide-in', title: 'Slide in' },
              { value: 'slide-out', title: 'Slide out' },
              { value: 'fade-in', title: 'Fade in' },
              { value: 'fade-out', title: 'Fade out' }
            ]
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'content',
      background: 'background'
    },
    prepare ({ title = 'No title', media = [], background = {} }) {
      const mediaRef = background.image
        ? background.image
        : media.find(({ _type, asset }) => _type === 'image' && asset)
      console.log(mediaRef)
      const mediaUrl =
        (mediaRef &&
          urlFor(mediaRef.asset._ref)
            .width(200)
            .url()) ||
        ''
      return {
        title,
        media: (
          <SlidePreview
            mediaUrl={mediaUrl}
            title={title}
            background={background}
          />
        )
      }
    }
  }
}

function invertColor (hex = '') {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1)
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.')
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16)
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b)
}

function padZero (str, len) {
  len = len || 2
  var zeros = new Array(len).join('0')
  return (zeros + str).slice(-len)
}
