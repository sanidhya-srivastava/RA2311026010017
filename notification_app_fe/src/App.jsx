import React, { useEffect } from 'react';
import { Log } from 'logging_middleware';
import Layout from './components/Layout';

export default function App() {
  useEffect(() => {
    Log('frontend', 'info', 'component', 'Campus Notifications App initialized successfully');
  }, []);

  return <Layout />;
}
