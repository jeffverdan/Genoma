import React from 'react';
import Header from '../../components/Header'

export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
    return (
      <section>
        <Header />
        {children}
      </section>      
    )
}