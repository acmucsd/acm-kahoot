import React, { useState } from 'react';

import styles from './styles.module.scss';
import triangleImg from '../../../../../../assets/triangle.svg';
import starImg from '../../../../../../assets/star.svg';
import squareImg from '../../../../../../assets/square.svg';
import circleImg from '../../../../../../assets/circle.svg';

const shapeImages = {
  triangle: triangleImg,
  star: starImg,
  square: squareImg,
  circle: circleImg,
}

export default function QuestionCard({ shape, question }) {
  const [isVisible, setVisible] = useState(true);
  const [isShort, setShort] = useState(false);

  let decoration;
  if (shape) {
    decoration = <img className={styles.shape} src={shapeImages[shape]} alt='' height='100' width='100' />;
  } else {
    decoration = <div className={styles.number}><div>12</div></div>;
  }

  if (isVisible) {
    return (
      <div className={`${styles.QuestionCard} ${styles[shape] || styles.default} ${isShort && styles.short}`}
          onClick={() => setShort(true)}
          onAnimationEnd={(event) => setVisible(true)}>
        {decoration}
        <div className={styles.label}>
          {question || 'Sample Question'}
        </div>
      </div>
    );
  }

  return null;
}