const React = require('react');
const ReactDOMServer = require('react-dom/server');

const browserify = require('browserify');
const express = require('express');

const app = express();

app.set('port', (process.argv[2] || 3000));

/* the below lines are no longer necessary when the app is isomorphic;
   the application is no longer fully server rendered
   because after the first request the client handles rendering
*/

// app.set('view engine', 'jsx');
// app.set('views', __dirname + '/views');
// app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

require('babel/register');

const TodoBox = require('./views/index.jsx');

const data = [
  {
    title: 'Shopping',
    detail: 'Milk', // process.argv[3]
  },
  {
    title: 'Hair cut',
    detail: '13:00', // process.argv[4]
  },
];

app.use('/bundle.js', (req, res) => {
  res.setHeader('content-type', 'application/javascript');
  browserify('./app.js')
    .transform('babelify', { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(res);
});

app.use('/', (req, res) => {
  const initialData = JSON.stringify(data);
  const markup = ReactDOMServer.renderToString(React.createElement(TodoBox, { data }));
  res.setHeader('Content-Type', 'text/html');
  const html = ReactDOMServer.renderToStaticMarkup(React.createElement('body', null,
    React.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: markup } }),
    React.createElement('script', {
      id: 'initial-data',
      type: 'text/plain',
      'data-json': initialData,
    }),
    React.createElement('script', { src: '/bundle.js' }),
  ));
  res.end(html);
});

/* sends up initial data with script tag of bundle.js

this means the client appears to load quicker as the HTML is pre-rendered on this first pass

the script tag causes the browser to request bundle.js , which hits the app.use endpoint '/bundle.js'
  the whole application is then sent to the client which can now act fully autonomously
*/


app.listen(app.get('port'), () => {
  console.log('listening on port %s', app.get('port').toString());
});
