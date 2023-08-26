import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import RotatingBanner from '../components/RotatingBanner';

function AboutUsScreen() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Container className='mt-3'>
      <h1>About Us</h1>
      <RotatingBanner />
      <p>
        Welcome to Savore Café Shop, your ultimate destination for exquisite
        coffee and pastries. Our journey began with a shared love for the art of
        brewing and baking, and we are thrilled to share that passion with you.
      </p>
      <h2>Our Journey</h2>
      <p>
        Established in the heart of the city, Savore Café Shop started as a
        dream to create a space where people could truly savor the flavors of
        life. With dedication and determination, we embarked on a journey to
        curate a menu that embodies our commitment to quality and creativity.
      </p>
      <p>
        Our baristas and bakers are artisans, each crafting their creations with
        care and precision. We believe that every cup of coffee and every bite
        of pastry should be an experience to remember, a moment of pure
        indulgence.
      </p>
      <h2>Our Values</h2>
      <p>
        At Savore Café Shop, our values are the foundation of everything we do.
        Quality is our priority, and we source the finest ingredients to create
        beverages and treats that are second to none. Sustainability is
        ingrained in our ethos, and we strive to minimize our environmental
        footprint with responsible practices.
      </p>
      <p>
        Community is at the heart of our cafe. We are more than a business; we
        are a gathering place for friends, families, and individuals to connect
        over shared passions and experiences. Your satisfaction is our success,
        and we are committed to ensuring that each visit leaves you with a
        smile.
      </p>
      <h2>Meet the Co-Founders</h2>
      <p>
        Savore Café Shop was founded by a team of passionate individuals who
        share a common love for coffee and a commitment to providing an
        exceptional experience. Let us introduce you to the co-founders who
        bring their unique talents to our cafe:
      </p>
      <ul>
        <li>
          Nguyễn Ngọc Hân - Creative Visionary: Hân's imaginative touch brings
          our cafe's ambiance to life, making every visit an immersive
          experience.
        </li>
        <li>
          Nguyễn Tuấn Kiệt - Coffee Connoisseur: Kiệt's expertise in sourcing
          and roasting coffee beans elevates our brews to new heights, ensuring
          that each cup is a masterpiece of flavor.
        </li>
        <li>
          Phạm Thị Như Yến - Pastry Maestro: Yến's artistic flair and culinary
          skills turn our pastries into edible works of art, bringing joy to
          your taste buds with every bite.
        </li>
        <li>
          Trần Minh Châu - Hospitality Maven: Châu's warm personality and
          dedication to service create an inviting atmosphere where everyone
          feels like family.
        </li>
        <li>
          Nguyễn Xuân Đạt - Innovator Extraordinaire: Đạt's creative mind drives
          our menu's diversity, ensuring that there's always something new and
          exciting to try.
        </li>
      </ul>
      <p>
        Together, our co-founders have crafted Savore Café Shop as a place where
        flavor, warmth, and quality come together. We invite you to join us on
        this journey and indulge in a delightful experience that's fueled by our
        shared passion.
      </p>
      <p>
        Thank you for choosing Savore Café Shop. We look forward to serving you
        and creating memories together, one cup and one pastry at a time.
      </p>
    </Container>
  );
}

export default AboutUsScreen;
