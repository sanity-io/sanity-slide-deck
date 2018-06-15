import VideoPreview from './components/VideoPreview';
export default {
    type: 'object',
    name: 'slideVideo',
    title: 'Video',
    fields: [
        {
            type: 'file',
            name: 'file',
            title: 'Video file'
        },
        {
            type: 'url',
            name: 'url',
            title: 'Video url'
        },
        {
            name: 'autoplay',
            title: 'Autoplay',
            description: 'Autplays videos on platforms that support it.',
            type: 'boolean',
        }
    ],
    preview: {
        select: {
            file: 'file',
            url: 'url'
        },
        component: VideoPreview
    }
}