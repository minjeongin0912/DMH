import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import BlurText from './BlurText';
import ClickSpark from './ClickSpark';
import Dock from './Dock';
import { formatMoney } from './money';
import './styles.css';

const K = {
  memberCoupon: '\uD68C\uC6D0 \uAC00\uC785\uD558\uACE0 5,000\uC6D0 \uCFE0\uD3F0 \uBC1B\uAE30',
  promo: '\uC2E0\uADDC \uD68C\uC6D0 \uCFE0\uD3F0 + \uC778\uAE30 \uCE90\uB9AD\uD130 \uAD7F\uC988 \uD2B9\uAC00 \uC9C4\uD589 \uC911',
  category: '\uCE74\uD14C\uACE0\uB9AC', brand: '\uBE0C\uB79C\uB4DC', summer: '\uC5EC\uB984\uD544\uC218\uD15C', all: '\uC804\uCCB4\uC0C1\uD488', new: '\uC2E0\uC0C1\uD15C', best: '\uBCA0\uC2A4\uD2B8', character: '\uCE90\uB9AD\uD130', keyring: '\uD0A4\uB9C1', living: '\uC0DD\uD65C\uC6A9\uD488', car: '\uCC28\uB7C9\uC6A9\uD488', phoneCase: '\uD3F0\uCF00\uC774\uC2A4',
  interior: '\uC778\uD14C\uB9AC\uC5B4', pouch: '\uD30C\uC6B0\uCE58', sticker: '\uC2A4\uD2F0\uCEE4', doll: '\uC778\uD615', kitchen: '\uC8FC\uBC29', damgom: '\uB2F4\uACF0\uC774', rilakkuma: '\uB9AC\uB77D\uCFE0\uB9C8', meonjak: '\uBA3C\uC791\uADC0', shinchan: '\uC9F1\uAD6C', joanne: '\uC870\uC564\uD504\uB80C\uC988', happy: '\uD574\uD53C\uD074\uB7FD', bbang: '\uBE75\uBE75\uC774', preorder: '\uC608\uC57D\uD310\uB9E4', won: '\uC6D0', goods: '\uAD7F\uC988', cushion: '\uCFE0\uC158', blanket: '\uB2F4\uC694', figure: '\uD53C\uADDC\uC5B4', umbrella: '\uC591\uC6B0\uC0B0', carrier: '\uCE90\uB9AC\uC5B4', towel: '\uC218\uAC74', freshener: '\uBC29\uD5A5\uC81C', mug: '\uBA38\uADF8\uCEF5', mat: '\uB9E4\uD2B8', set: '\uC138\uD2B8', mini: '\uBBF8\uB2C8', face: '\uC5BC\uAD74'
};
const I = {
  banner1: '\uBC30\uB1081.png', banner2: '\uBC30\uB1082.png', banner3: '\uBC30\uB1083.png', banner4: '\uBC30\uB1084.png', banner5: '\uBC30\uB1085.png', banner6: '\uBC30\uB1086.png', icon1: '\uC544\uC774\uCF581.png', icon2: '\uC544\uC774\uCF582.png', icon3: '\uC544\uC774\uCF583.png', icon4: '\uC544\uC774\uCF584.png', icon5: '\uC544\uC774\uCF585.png',
  interior1: '\uC778\uD14C\uB9AC\uC5B41.jPG', interior2: '\uC778\uD14C\uB9AC\uC5B42.jpg', interior3: '\uC778\uD14C\uB9AC\uC5B43.jPG', interior4: '\uC778\uD14C\uB9AC\uC5B44.jpg', interior5: '\uC778\uD14C\uB9AC\uC5B45.jpg', interior6: '\uC778\uD14C\uB9AC\uC5B46.jpg', interior7: '\uC778\uD14C\uB9AC\uC5B47.jpg', furniture2: '\uAC00\uAD6C2.jPG',
  pouch1: '\uD30C\uC6B0\uCE581.jpg', pouch2: '\uD30C\uC6B0\uCE582.png', pouch3: '\uD30C\uC6B0\uCE583.png', pouch4: '\uD30C\uC6B0\uCE584.jPG', sticker1: '\uC2A4\uD2F0\uCEE41.jpg', sticker2: '\uC2A4\uD2F0\uCEE42.png', new1: '\uC2E0\uC0C11.jpg', new2: '\uC2E0\uC0C12.jpg', new3: '\uC2E0\uC0C13.jpg', new4: '\uC2E0\uC0C14.jpg', new5: '\uC2E0\uC0C15.jpg', new6: '\uC2E0\uC0C16.jpg', new7: '\uC2E0\uC0C17.png', new8: '\uC2E0\uC0C18.png',
  ril1: '\uB9AC\uB77D\uCFE0\uB9C81.jpg', ril2: '\uB9AC\uB77D\uCFE0\uB9C82.jPG', ril3: '\uB9AC\uB77D\uCFE0\uB9C83.jpg', ril4: '\uB9AC\uB77D\uCFE0\uB9C84.jpg', ril5: '\uB9AC\uB77D\uCFE0\uB9C85.jPG', ril6: '\uB9AC\uB77D\uCFE0\uB9C86.jpg', ril7: '\uB9AC\uB77D\uCFE0\uB9C87.jpg', ril8: '\uB9AC\uB77D\uCFE0\uB9C88.jpg', ril9: '\uB9AC\uB77D\uCFE0\uB9C89.jpg', ril10: '\uB9AC\uB77D\uCFE0\uB9C810.jpg',
  dam1: '\uB2F4\uACF01.jpg', dam2: '\uB2F4\uACF02.jPG', dam3: '\uB2F4\uACF03.jPG', dam4: '\uB2F4\uACF04.jPG', dam5: '\uB2F4\uACF05.jPG', dam6: '\uB2F4\uACF06.jpg', dam7: '\uB2F4\uACF07.jPG', dam8: '\uB2F4\uACF08.jpg', dam9: '\uB2F4\uACF09.jpg', dam10: '\uB2F4\uACF010.jpg', damCat: '\uB2F4\uACF0_\uCE74\uD14C\uACE0\uB9AC.jpg',
  shin1: '\uC9F1\uAD6C1.jpg', shin2: '\uC9F1\uAD6C2.png', shin3: '\uC9F1\uAD6C3.png', shin4: '\uC9F1\uAD6C4.jPG', shin5: '\uC9F1\uAD6C5.jpg', shin6: '\uC9F1\uAD6C6.jPG', shin7: '\uC9F1\uAD6C7.jpg', shin8: '\uC9F1\uAD6C8.jPG', shin9: '\uC9F1\uAD6C9.jPG', shin10: '\uC9F1\uAD6C10.jPG', shinCat: '\uC9F1\uAD6C_\uCE74\uD14C\uACE0\uB9AC.jpg',
  meonjakTowel: '2024-10-28_\uBA3C\uC791\uADC0\uC218\uAC74_\uD53C\uC528_v1_copy_2.png', usagiCarrier: '2025-06-09_\uC6B0\uC0AC\uAE30\uCE90\uB9AC\uC5B4_\uD53C\uC528_v1_copy_2.png', freshener: '2023-09-28_\uBC29\uD5A5\uC81C_\uD53C\uC528_v1.png', rilUmbrella: '\uB9AC\uB77D\uCFE0\uB9C8_\uD328\uD134_\uC591\uC6B0\uC0B0_\uD648\uD398\uC774\uC9C0-1.jpg',
  best1: '\uBCA0\uC2A4\uD2B81.jpg', best2: '\uBCA0\uC2A4\uD2B82.jpg', best3: '\uBCA0\uC2A4\uD2B83.jpg', best4: '\uBCA0\uC2A4\uD2B84.jpg', best5: '\uBCA0\uC2A4\uD2B85.jpg', best6: '\uBCA0\uC2A4\uD2B86.jpg',
  rilPouchBanner: '\uB9AC\uB77D\uCFE0\uB9C8_\uC870\uB9AC\uAC1C_\uD30C\uC6B0\uCE58_4\uC885_\uBC30\uB108_(3).jpg'
};
const topBanners = [{ className: 'black', text: K.memberCoupon }, { className: 'yellow', text: K.promo }];
const keywords = [K.rilakkuma, K.meonjak, K.keyring, K.doll, K.sticker, K.pouch, 'sanrio'];
const navItems = [['☰', K.category], ['❖', K.brand], ['⌂', 'HOME'], ['♡', 'WISH'], ['👤', 'MY']];
const mobileCategories = [K.summer, K.all, K.new, K.best, K.character, K.keyring, K.living, K.car, K.phoneCase];
const leftShopCategories = [K.summer, K.all, K.new, K.best, K.character, K.keyring, K.living, K.car, K.phoneCase];
const headerIcons = {
  search: { viewBox: '0 0 512 512', path: 'M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.2 253.9 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z' },
  cart: { viewBox: '0 0 576 512', path: 'M0 24C0 10.7 10.7 0 24 0h45.5c22 0 41.5 12.8 50.6 32H531c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1-96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z' },
  heart: { viewBox: '-32 -32 576 576', path: 'M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3C0 119.1 50 58.7 119.2 45.5c39.4-7.5 79.7 1.7 111.8 24.1c9 6.3 17.4 13.9 25 22.4c7.6-8.5 16-16.1 25-22.4c32.1-22.4 72.4-31.6 111.8-24.1C462 58.7 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.8-30.2 11.8s-22-4.2-30.2-11.8z' },
};
const mainBanners = [I.banner1, I.banner2, I.banner3, I.banner4, I.banner5, I.banner6];
const iconCategories = [{ key: 'interior', image: I.icon1, label: K.interior }, { key: 'pouch', image: I.icon2, label: K.pouch }, { key: 'sticker', image: I.icon3, label: K.sticker }, { key: 'doll', image: I.icon4, label: K.doll }, { key: 'kitchen', image: I.icon5, label: K.kitchen }];
const item = (image, brand, title, oldPrice, discount, price) => ({ image, brand, title, oldPrice, discount, price });
const price = (value) => value + K.won;
const t = (...parts) => parts.filter(Boolean).join(' ');
const rankingInteriorItems = [
  item(I.interior1, K.damgom, t(K.damgom, K.cushion, K.blanket, K.set), '', '', price('18,800')),
  item(I.interior2, K.meonjak, t(K.meonjak, '\uCE58\uC774\uCE74\uC640', '\uBAA8\uB2C8\uD130', K.figure), price('8,800'), '43%', price('5,000')),
  item(I.interior3, K.damgom, t(K.damgom, '\uACE0\uB85C\uCF00', '\uC904\uC790', K.keyring), price('7,900'), '49%', price('3,990')),
  item(I.interior4, K.joanne, t(K.joanne, K.mini, K.figure), '', '', price('22,800')),
  item(I.interior5, K.damgom, t(K.damgom, '\uBA74\uAE30', K.set), '', '', price('14,800')),
  item(I.furniture2, K.joanne, t(K.joanne, '\uB370\uC2A4\uD06C', '\uC120\uBC18'), '', '', price('53,800')),
  item(I.interior6, K.happy, t('\uD551\uD06C', '\uCF54\uB86F\uD1A0', '\uC2A4\uD0E0\uB4DC'), price('6,900'), '28%', price('4,900')),
  item(I.interior7, K.damgom, t(K.damgom, K.mug), '', '', price('12,800')),
];
const rankingPouchItems = [
  item(I.pouch1, K.rilakkuma, t(K.rilakkuma, K.mini, K.pouch), price('8,000'), '18%', price('6,500')),
  item(I.ril8, K.rilakkuma, t('\uBCF4\uB4E4\uBCF4\uB4E4', K.rilakkuma, '\uC0AC\uAC01', K.pouch), price('12,000'), '25%', price('9,000')),
  item(I.rilPouchBanner, K.rilakkuma, t(K.rilakkuma, '\uC870\uB9AC\uAC1C', K.pouch, '4\uC885'), price('9,800'), '20%', price('7,800')),
  item(I.pouch2, K.rilakkuma, t(K.rilakkuma, '\uC870\uB9AC\uAC1C', K.pouch), price('9,800'), '20%', price('7,800')),
  item(I.pouch3, K.rilakkuma, t(K.rilakkuma, '\uB77C\uC6B4\uB4DC', K.pouch), price('9,500'), '21%', price('7,500')),
  item(I.ril7, K.rilakkuma, t(K.rilakkuma, '\uD0DC\uBE14\uB9BF', K.pouch, '13\uC778\uCE58'), price('46,000'), '19%', price('37,000')),
  item(I.pouch4, K.rilakkuma, t(K.rilakkuma, '\uB300\uD615', '\uC9C0\uD37C', K.pouch), price('9,500'), '21%', price('7,500')),
];
const rankingStickerItems = [item(I.dam1, K.damgom, t(K.damgom, '\uBE45', K.sticker, K.set), '', '', price('4,000')), item(I.sticker1, K.damgom, t(K.damgom, '\uB2E4\uC774\uC5B4\uB9AC', K.sticker), '', '', price('3,500')), item(I.sticker2, K.shinchan, t(K.shinchan, K.character, K.sticker), price('5,000'), '20%', price('4,000')), item(I.ril3, K.rilakkuma, t(K.rilakkuma, K.mini, K.sticker), price('5,000'), '20%', price('4,000'))];
const rankingItemsByTab = { [K.interior]: rankingInteriorItems, [K.pouch]: rankingPouchItems, [K.sticker]: rankingStickerItems };
const bestItems = [
  item(I.best1, K.rilakkuma, t(K.rilakkuma, '20\uC778\uCE58', K.carrier), price('89,000'), '14%', price('75,800')),
  item(I.best2, '\uCF54\uB9AC\uB77D\uCFE0\uB9C8', t('\uCF54\uB9AC\uB77D\uCFE0\uB9C8', '18\uC778\uCE58', K.carrier), price('87,000'), '14%', price('74,800')),
  item(I.best3, K.rilakkuma, t(K.rilakkuma, '\uC2A4\uD06C\uB7F0\uCE58', '\uBA38\uB9AC\uB048'), price('6,800'), '19%', price('5,500')),
  item(I.best4, '\uC0B0\uB9AC\uC624', t('\uC0B0\uB9AC\uC624', K.character, '\uD074\uB9BD', K.set), price('25,900'), '23%', price('19,900')),
  item(I.best5, K.shinchan, t(K.shinchan, K.character, K.goods, K.set), price('18,000'), '17%', price('14,900')),
  item(I.best6, K.damgom, t(K.damgom, K.keyring, K.set), price('15,000'), '13%', price('13,000')),
  item(I.ril9, K.rilakkuma, t(K.rilakkuma, '\uD328\uD134', K.umbrella), price('24,000'), '17%', price('19,800')),
  item(I.ril8, K.rilakkuma, t('\uBCF4\uB4E4\uBCF4\uB4E4', K.rilakkuma, K.mini, '\uC0AC\uAC01', K.pouch), price('12,000'), '25%', price('9,000')),
  item(I.pouch1, K.rilakkuma, t(K.rilakkuma, K.mini, K.pouch), price('8,000'), '18%', price('6,500')),
  item(I.ril7, K.rilakkuma, t(K.rilakkuma, '\uD0DC\uBE14\uB9BF', K.pouch, '13\uC778\uCE58'), price('46,000'), '20%', price('36,630')),
];
const newItems = [item(I.new1, K.preorder, t('\uCC28\uC774\uB85C\uC774\uCF54\uAD6C\uB9C8', K.mini, K.carrier), price('39,000'), '15%', price('32,800')), item(I.new2, K.bbang, t(K.bbang, K.character, K.cushion, K.doll), price('42,800'), '7%', price('39,800')), item(I.new3, K.bbang, t('\uC625\uC9C0', K.character, K.cushion, K.doll), price('42,800'), '7%', price('39,800')), item(I.new4, K.bbang, t('\uBD09\uC81C', '\uBC14\uB514', '\uD544\uB85C\uC6B0', K.doll), price('42,800'), '7%', price('39,800')), item(I.new5, K.bbang, t(K.bbang, '\uBC14\uB514', '\uD544\uB85C\uC6B0'), price('42,800'), '7%', price('39,800')), item(I.new6, K.bbang, t('\uC544\uAE30', K.cushion, '\uBD09\uC81C', '\uD544\uB85C\uC6B0'), price('37,000'), '5%', price('34,800')), item(I.new7, K.bbang, t(K.bbang, '\uC544\uAE30', K.cushion), price('37,000'), '5%', price('34,800')), item(I.new8, K.bbang, t(K.face, K.mat), price('22,000'), '13%', price('19,000'))];
const iconCategoryProducts = { interior: rankingInteriorItems, pouch: rankingPouchItems, sticker: rankingStickerItems, doll: newItems, kitchen: rankingInteriorItems };
const rilakkumaItems = [item(I.ril1, K.rilakkuma, t(K.rilakkuma, K.face, K.keyring), price('10,500'), '19%', price('8,500')), item(I.ril2, K.rilakkuma, t(K.rilakkuma, K.mini, K.pouch, K.set), price('8,000'), '18%', price('6,500')), item(I.ril3, K.rilakkuma, t(K.rilakkuma, K.mini, K.sticker), price('5,000'), '20%', price('4,000')), item(I.ril4, K.rilakkuma, t('\uCC28\uC774\uB85C\uC774\uCF54\uAD6C\uB9C8', '\uD0DC\uBE14\uB9BF', K.pouch), price('46,000'), '19%', price('37,000')), item(I.ril5, K.rilakkuma, t(K.rilakkuma, '\uBE0C\uB7EC\uC26C'), price('6,000'), '16%', price('5,000')), item(I.ril6, K.rilakkuma, t(K.rilakkuma, '\uB370\uC2A4\uD06C', K.mat), price('26,500'), '21%', price('20,790')), item(I.ril7, K.rilakkuma, t(K.rilakkuma, '\uD0DC\uBE14\uB9BF', K.pouch), price('46,000'), '20%', price('36,630')), item(I.ril8, K.rilakkuma, t('\uBCF4\uB4E4\uBCF4\uB4E4', K.rilakkuma, K.pouch), price('12,000'), '25%', price('9,000')), item(I.ril9, K.rilakkuma, t(K.rilakkuma, '\uD328\uD134', K.pouch), price('9,800'), '20%', price('7,800')), item(I.ril10, K.rilakkuma, t(K.rilakkuma, '\uBC18\uC6D0', K.pouch), price('9,800'), '20%', price('7,800'))];
const shinchanItems = [item(I.shin1, K.shinchan, t(K.shinchan, K.keyring), price('9,000'), '12%', price('7,900')), item(I.shin2, K.shinchan, t('\uC561\uC158\uAC00\uBA74', K.shinchan, K.keyring), price('8,500'), '18%', price('6,900')), item(I.shin3, K.shinchan, t('\uD770\uB465\uC774', K.mini, K.pouch), price('12,000'), '17%', price('9,900')), item(I.shin4, K.shinchan, t(K.shinchan, '\uB370\uC2A4\uD06C', K.figure), price('13,000'), '10%', price('11,700')), item(I.shin5, K.shinchan, t(K.shinchan, K.sticker, K.set), price('5,000'), '20%', price('4,000')), item(I.shin6, K.shinchan, t(K.shinchan, K.mug), price('15,000'), '14%', price('12,900')), item(I.shin7, K.shinchan, t(K.shinchan, K.mini, K.doll), price('18,000'), '16%', price('15,000')), item(I.shin8, K.shinchan, t(K.shinchan, '\uBB38\uAD6C', K.set), price('9,000'), '11%', price('8,000')), item(I.shin9, K.shinchan, t(K.shinchan, '\uCE74\uB4DC\uC9C0\uAC11'), price('14,000'), '15%', price('11,900')), item(I.shin10, K.shinchan, t(K.shinchan, K.character, K.cushion), price('24,000'), '17%', price('19,900'))];
const damgomItems = [item(I.dam1, K.damgom, t(K.damgom, '\uBE45', K.sticker, K.set), '', '', price('4,000')), item(I.dam2, K.damgom, t(K.damgom, K.face, K.keyring), price('9,000'), '12%', price('7,900')), item(I.dam3, K.damgom, t(K.damgom, K.mini, K.doll), price('17,000'), '12%', price('14,900')), item(I.dam4, K.damgom, t(K.damgom, K.pouch), price('12,000'), '17%', price('9,900')), item(I.dam5, K.damgom, t(K.damgom, '\uBD09\uC81C', K.cushion), price('22,000'), '14%', price('18,900')), item(I.dam6, K.damgom, t(K.damgom, '\uB370\uC2A4\uD06C', K.mat), price('19,000'), '11%', price('16,900')), item(I.dam7, K.damgom, t(K.damgom, '\uCEF5\uBC1B\uCE68', K.set), price('7,000'), '15%', price('5,900')), item(I.dam8, K.damgom, t(K.damgom, K.mini, '\uC218\uB0A9\uD568'), price('13,000'), '10%', price('11,700')), item(I.dam9, K.damgom, t(K.damgom, '\uB178\uD2B8\uBD81', K.pouch), price('28,000'), '18%', price('22,900')), item(I.dam10, K.damgom, t(K.damgom, K.keyring, K.set), price('15,000'), '13%', price('13,000'))];
const meonjakItems = [item(I.meonjakTowel, K.meonjak, t(K.meonjak, '\uCE58\uC774\uCE74\uC640', K.towel, K.set), price('18,000'), '22%', price('14,000')), item(I.usagiCarrier, K.meonjak, t('\uC6B0\uC0AC\uAE30', K.mini, K.carrier), price('59,000'), '15%', price('49,800')), item(I.interior2, K.meonjak, t(K.meonjak, '\uCE58\uC774\uCE74\uC640', K.figure), price('8,800'), '43%', price('5,000')), item(I.pouch2, K.meonjak, t(K.meonjak, K.mini, K.pouch), price('9,800'), '20%', price('7,800')), item(I.sticker1, K.meonjak, t(K.meonjak, '\uB2E4\uC774\uC5B4\uB9AC', K.sticker), price('5,000'), '20%', price('4,000')), item(I.new1, K.meonjak, t('\uCC28\uC774\uB85C\uC774\uCF54\uAD6C\uB9C8', K.mini, K.carrier), price('39,000'), '15%', price('32,800'))];
const characterProducts = { rilakkuma: { label: K.rilakkuma, image: I.ril1, items: rilakkumaItems }, shinchan: { label: K.shinchan, image: I.shinCat, items: shinchanItems }, damgom: { label: K.damgom, image: I.damCat, items: damgomItems }, meonjak: { label: K.meonjak, image: I.meonjakTowel, items: meonjakItems } };
const brandProducts = characterProducts;

const allSearchItems = Array.from(
  new Map(
    [
      ...newItems,
      ...bestItems,
      ...rankingInteriorItems,
      ...rankingPouchItems,
      ...rankingStickerItems,
      ...rilakkumaItems,
      ...shinchanItems,
      ...damgomItems,
      ...meonjakItems,
    ].map((item) => [item.image, item]),
  ).values(),
);

const uniqueItems = (items) => Array.from(new Map(items.map((item) => [item.image, item])).values());
const filterItemsByWords = (words, fallback = []) => {
  const matches = allSearchItems.filter((item) => (
    words.some((word) => `${item.brand} ${item.title}`.includes(word))
  ));

  return matches.length ? uniqueItems(matches) : fallback;
};

const categoryProductsByName = {
  [mobileCategories[0]]: uniqueItems([
    ...filterItemsByWords(['양우산', '우산', '캐리어', '여행'], []),
    ...bestItems.slice(0, 4),
  ]),
  [mobileCategories[1]]: allSearchItems,
  [mobileCategories[2]]: newItems,
  [mobileCategories[3]]: bestItems,
  [mobileCategories[4]]: uniqueItems(Object.values(characterProducts).flatMap((brand) => brand.items)),
  [mobileCategories[5]]: filterItemsByWords(['키링', '체인'], bestItems.slice(0, 6)),
  [mobileCategories[6]]: filterItemsByWords(['쿠션', '담요', '매트', '컵', '머그', '식기', '그릇', '브러쉬', '우산'], rankingInteriorItems),
  [mobileCategories[7]]: filterItemsByWords(['차량', '자동차', '방향제'], bestItems.slice(4, 9)),
  [mobileCategories[8]]: filterItemsByWords(['폰케이스', '케이스', '에어팟', '아이패드', '노트북'], rankingPouchItems),
};

function TopBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % topBanners.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const banner = topBanners[active];

  return <div className={`top-banner ${banner.className}`}>{banner.text}</div>;
}

function HeaderIcon({ type, label }) {
  const icon = headerIcons[type];

  return (
    <svg
      className={`header-icon header-icon-${type}`}
      viewBox={icon.viewBox}
      aria-label={label}
      role="img"
    >
      <path d={icon.path} />
    </svg>
  );
}

function MyDockIcon() {
  return (
    <svg className="my-dock-icon" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="15" r="9" />
      <path d="M7 42c1.7-10.3 8.2-16 17-16s15.3 5.7 17 16H7z" />
    </svg>
  );
}

function MenuChevronIcon() {
  return (
    <svg className="left-menu-chevron" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg className="back-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function MainBannerSlider({ onProductOpen }) {
  const [active, setActive] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const loopBanners = [...mainBanners, ...mainBanners];
  const bannerProduct = newItems[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWithTransition(true);
      setActive((current) => current + 1);
    }, 3000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (active !== mainBanners.length) return undefined;

    const resetTimer = window.setTimeout(() => {
      setWithTransition(false);
      setActive(0);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setWithTransition(true));
      });
    }, 430);

    return () => window.clearTimeout(resetTimer);
  }, [active]);

  return (
    <section className="main-banner" aria-label="메인 배너">
      <div
        className="banner-track"
        role="button"
        tabIndex={0}
        onClick={() => onProductOpen?.(bannerProduct)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') onProductOpen?.(bannerProduct);
        }}
        style={{
          transform: `translateX(-${active * 280}px)`,
          transition: withTransition ? undefined : 'none',
        }}
      >
        {loopBanners.map((banner, index) => (
          <img src={`/images/${banner}`} alt="메인 배너" key={`${banner}-${index}`} />
        ))}
      </div>
      <div className="banner-dots">
        {mainBanners.map((banner, index) => (
          <span className={index === active % mainBanners.length ? 'active' : ''} key={banner} />
        ))}
      </div>
    </section>
  );
}

function IconCategoryRow({ onSelect }) {
  return (
    <section className="icon-category-row" aria-label="상품 카테고리">
      {iconCategories.map((category) => (
        <button type="button" onClick={() => onSelect(category.key)} key={category.key}>
          <span>
            <img src={`/images/${category.image}`} alt="" />
          </span>
          <strong>{category.label}</strong>
        </button>
      ))}
    </section>
  );
}

function ProductActionButtons({ item, onWish, onCart, wished = false }) {
  return (
    <div className="product-action-buttons">
      <button
        className={`product-action-button wish ${wished ? 'active' : ''}`}
        type="button"
        aria-label="관심상품 담기"
        onClick={(event) => {
          event.stopPropagation();
          onWish?.(item);
        }}
      >
        <HeaderIcon type="heart" label="관심상품" />
      </button>
      <button
        className="product-action-button"
        type="button"
        aria-label="장바구니 담기"
        onClick={(event) => {
          event.stopPropagation();
          onCart?.(item);
        }}
      >
        <HeaderIcon type="cart" label="장바구니" />
      </button>
    </div>
  );
}

function QuickViewOverlay({ item, wished, onWish, onCart, onViewDetail, onClose }) {
  return createPortal(
    <div
      className="quick-view-backdrop"
      role="presentation"
      onClick={(event) => {
        event.stopPropagation();
        onClose();
      }}
    >
      <div
        className="quick-view-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="quick-view-close" type="button" aria-label="?リ린" onClick={onClose}>횞</button>
        <img src={`/images/${item.image}`} alt={item.title} />
        <p className="brand">{item.brand}</p>
        <h3>{item.title}</h3>
        <p className="old-price">{item.oldPrice}</p>
        <strong>
          <span>{item.discount}</span> {item.price}
        </strong>
        <div className="quick-view-actions">
          <button
            className={`quick-view-wish ${wished ? 'active' : ''}`}
            type="button"
            onClick={() => onWish?.(item)}
          >
            {wished ? '찜 해제' : '관심상품'}
          </button>
          <button className="quick-view-cart" type="button" onClick={() => onCart?.(item)}>장바구니</button>
        </div>
        <button className="quick-view-detail-link" type="button" onClick={onViewDetail}>상세보기</button>
      </div>
    </div>,
    document.body,
  );
}

function ProductCard({ item, onOpen, onWish, onCart, wished = false, onRemove }) {
  const hasDiscount = Boolean(item.discount);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <article className={`new-product-card ${hasDiscount ? 'has-discount' : 'no-discount'}`} onClick={() => onOpen?.(item)}>
      <div className="new-product-image">
        <img src={`/images/${item.image}`} alt={item.title} />
        <button
          className="quick-view-trigger"
          type="button"
          aria-label="빠른보기"
          onClick={(event) => {
            event.stopPropagation();
            setQuickViewOpen(true);
          }}
        >
          <HeaderIcon type="search" label="빠른보기" />
        </button>
        <ProductActionButtons item={item} onWish={onWish} onCart={onCart} wished={wished} />
        {onRemove && (
          <button
            className="product-remove-button"
            type="button"
            aria-label="상품 삭제"
            onClick={(event) => {
              event.stopPropagation();
              onRemove(item);
            }}
          >
            ×
          </button>
        )}
      </div>
      <p className="brand">{item.brand}</p>
      <h3>{item.title}</h3>
      <p className="old-price">{item.oldPrice}</p>
      <strong>
        <span>{item.discount}</span> {item.price}
      </strong>
      {quickViewOpen && (
        <QuickViewOverlay
          item={item}
          wished={wished}
          onWish={onWish}
          onCart={(cartItem) => {
            setQuickViewOpen(false);
            onCart?.(cartItem);
          }}
          onViewDetail={() => {
            setQuickViewOpen(false);
            onOpen?.(item);
          }}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </article>
  );
}

const getPriceNumber = (price = '') => Number(String(price).replace(/[^\d]/g, '')) || 0;

const getDiscountAmount = (item) => {
  const original = getPriceNumber(item.oldPrice);
  const price = getPriceNumber(item.price);
  return original > price ? original - price : 0;
};

const getSavedItemsKey = (uid) => `duckmate-saved-items:${uid}`;

const cleanSavedItems = (items = []) => (
  Array.isArray(items)
    ? items
      .filter((item) => item && item.image)
      .map((item) => ({
        brand: item.brand || '',
        title: item.title || '',
        image: item.image || '',
        oldPrice: item.oldPrice || '',
        discount: item.discount || '',
        price: item.price || '',
        qty: Math.max(1, Number(item.qty) || 1),
      }))
    : []
);

const cleanOrders = (orders = []) => (
  Array.isArray(orders)
    ? orders
      .filter((order) => order && order.id)
      .map((order) => ({
        id: order.id,
        productName: order.productName || '',
        totalAmount: Number(order.totalAmount) || 0,
        currency: order.currency || '',
        customerEmail: order.customerEmail || '',
        status: order.status || '',
        orderedAt: order.orderedAt || '',
      }))
    : []
);

const readLocalSavedItems = (uid) => {
  try {
    const saved = JSON.parse(localStorage.getItem(getSavedItemsKey(uid)) || '{}');
    return {
      wishItems: cleanSavedItems(saved.wishItems),
      cartItems: cleanSavedItems(saved.cartItems),
      orders: cleanOrders(saved.orders),
    };
  } catch {
    return { wishItems: [], cartItems: [], orders: [] };
  }
};

const writeLocalSavedItems = (uid, wishItems, cartItems, orders) => {
  try {
    localStorage.setItem(
      getSavedItemsKey(uid),
      JSON.stringify({
        wishItems: cleanSavedItems(wishItems),
        cartItems: cleanSavedItems(cartItems),
        orders: cleanOrders(orders),
      }),
    );
  } catch {
    // Local backup is optional; Firestore is still attempted.
  }
};

function ProductListPage({ title, items, onBack, onProductOpen, onWish, onCart, wishedItems, onRemove }) {
  return (
    <section className="new-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>{title}</h1>
      </div>
      {items.length > 0 ? (
        <div className="new-page-grid">
          {items.map((item) => (
            <ProductCard
              item={item}
              onOpen={onProductOpen}
              onWish={onWish}
              onCart={onCart}
              wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
              onRemove={onRemove}
              key={item.image}
            />
          ))}
        </div>
      ) : (
        <p className="empty-list-text">담긴 상품이 없습니다.</p>
      )}
    </section>
  );
}

function SearchPage({
  query,
  draft,
  results,
  inputRef,
  onDraftChange,
  onSubmit,
  onBack,
  onProductOpen,
  onWish,
  onCart,
  wishedItems,
}) {
  return (
    <section className="new-page mobile-search-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>검색</h1>
      </div>
      <form
        className="mobile-search-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="상품명을 검색해보세요"
          aria-label="검색어 입력"
        />
        <button type="submit" aria-label="검색">⌕</button>
      </form>
      <div className="mobile-search-keywords">
        {keywords.map((keyword) => (
          <button
            type="button"
            onClick={() => {
              onDraftChange(keyword);
              onSubmit(keyword);
            }}
            key={keyword}
          >
            {keyword}
          </button>
        ))}
      </div>
      {query ? (
        results.length > 0 ? (
          <div className="new-page-grid">
            {results.map((item) => (
              <ProductCard
                item={item}
                onOpen={onProductOpen}
                onWish={onWish}
                onCart={onCart}
                wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
                key={item.image}
              />
            ))}
          </div>
        ) : (
          <p className="empty-list-text">검색 결과가 없습니다.</p>
        )
      ) : (
        <p className="empty-list-text">찾고 싶은 상품명을 입력해 주세요.</p>
      )}
    </section>
  );
}

function CheckoutPage({ items, onBack }) {
  const total = items.reduce((sum, item) => sum + getPriceNumber(item.price) * (item.qty || 1), 0);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  const handlePay = async () => {
    setPaying(true);
    setPayError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: items[0].title }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      window.location.href = data.url;
    } catch (error) {
      setPayError(error.message);
      setPaying(false);
    }
  };

  return (
    <section className="new-page checkout-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>주문/결제</h1>
      </div>
      {items.length > 0 ? (
        <>
          <div className="checkout-list">
            {items.map((item) => (
              <article className="checkout-item" key={item.image}>
                <img src={`/images/${item.image}`} alt={item.title} />
                <div>
                  <p>{item.brand}</p>
                  <h2>{item.title}</h2>
                  <strong>{item.price}{item.qty > 1 ? ` × ${item.qty}` : ''}</strong>
                </div>
              </article>
            ))}
          </div>
          <div className="checkout-summary">
            <span>총 결제금액</span>
            <strong>{total.toLocaleString()}원</strong>
          </div>
          {items.length > 1 && (
            <p className="checkout-pay-note">첫 번째 상품({items[0].title}) 기준으로 결제가 진행됩니다.</p>
          )}
          {payError && <p className="checkout-pay-error">{payError}</p>}
          <button className="checkout-submit-button" type="button" disabled={paying} onClick={handlePay}>
            {paying ? '이동 중...' : '결제하기'}
          </button>
        </>
      ) : (
        <p className="empty-list-text">장바구니에 담긴 상품이 없습니다.</p>
      )}
    </section>
  );
}

function PaymentSuccessPanel({ checkoutId, onBack, onOrderConfirmed }) {
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkoutId) {
      setError('checkout_id 파라미터가 없습니다.');
      setLoading(false);
      return;
    }

    fetch(`/api/checkout-session?checkout_id=${encodeURIComponent(checkoutId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setSession(data);
        onOrderConfirmed?.({
          id: checkoutId,
          productName: data.productName,
          totalAmount: data.totalAmount,
          currency: data.currency,
          customerEmail: data.customerEmail,
          status: data.status,
          orderedAt: new Date().toISOString(),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId]);

  return (
    <section className="new-page payment-success-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>결제 결과</h1>
      </div>

      {loading && <p className="polar-status">결제 확인 중...</p>}
      {error && <p className="polar-error">{error}</p>}

      {session && (
        <>
          <h2 className="payment-success-title">
            {session.status === 'succeeded' || session.status === 'confirmed'
              ? '결제가 완료되었습니다.'
              : `결제 상태: ${session.status}`}
          </h2>
          <dl className="polar-success-details">
            <div><dt>상품</dt><dd>{session.productName}</dd></div>
            <div>
              <dt>결제 금액</dt>
              <dd>{formatMoney(session.totalAmount || 0, session.currency)}</dd>
            </div>
            <div><dt>이메일</dt><dd>{session.customerEmail}</dd></div>
          </dl>
        </>
      )}

      <button className="checkout-submit-button" type="button" onClick={onBack}>홈으로</button>
    </section>
  );
}

function formatPolarPrice(price) {
  if (!price) return '가격 정보 없음';
  if (price.amountType === 'free') return '무료';
  if (price.amountType === 'fixed') {
    return formatMoney(price.priceAmount, price.priceCurrency);
  }
  return '가격 문의';
}

function PolarShopPage({ onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payingId, setPayingId] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProducts(data.products || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (productId) => {
    setPayingId(productId);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setPayingId('');
    }
  };

  return (
    <section className="new-page polar-shop-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>구매하기 <span className="polar-shop-tag">Polar Sandbox</span></h1>
      </div>

      {loading && <p className="polar-status">상품을 불러오는 중...</p>}
      {error && <p className="polar-error">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="polar-status">등록된 상품이 없습니다.</p>
      )}

      <div className="polar-product-list">
        {products.map((product) => (
          <article className="polar-product-card" key={product.id}>
            <h2>{product.name}</h2>
            {product.description && <p className="polar-product-desc">{product.description}</p>}
            <strong>{formatPolarPrice(product.prices?.[0])}</strong>
            <button
              type="button"
              disabled={payingId === product.id}
              onClick={() => handleCheckout(product.id)}
            >
              {payingId === product.id ? '이동 중...' : '결제하기'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartItemRow({ item, selected, onToggleSelect, onOpen, onRemove, onQtyChange, onMoveToWish, onOrderOne }) {
  const qty = item.qty || 1;
  const itemTotalPrice = getPriceNumber(item.price) * qty;
  const itemDiscountTotal = getDiscountAmount(item) * qty;

  return (
    <article className="cart-item-row">
      <div className="cart-item-top">
        <label className="cart-item-checkbox">
          <input type="checkbox" checked={selected} onChange={() => onToggleSelect(item)} />
        </label>
        <button className="cart-item-remove" type="button" aria-label="상품 삭제" onClick={() => onRemove(item)}>×</button>
      </div>
      <div className="cart-item-body">
        <button className="cart-item-image" type="button" onClick={() => onOpen(item)}>
          <img src={`/images/${item.image}`} alt={item.title} />
        </button>
        <div className="cart-item-info">
          <h3 onClick={() => onOpen(item)}>{item.title}</h3>
          <p className="cart-item-shipping">배송비 3,000원 / 기본배송</p>
          <strong>{itemTotalPrice.toLocaleString()}원</strong>
          <span className="cart-item-discount">할인금액: -{itemDiscountTotal.toLocaleString()}원</span>
          <div className="cart-item-qty">
            <button type="button" onClick={() => onQtyChange(item, -1)} disabled={qty <= 1} aria-label="수량 줄이기">-</button>
            <span>{qty}</span>
            <button type="button" onClick={() => onQtyChange(item, 1)} aria-label="수량 늘리기">+</button>
          </div>
        </div>
      </div>
      <div className="cart-item-actions">
        <button type="button" onClick={() => onMoveToWish(item)}>관심상품</button>
        <button className="primary" type="button" onClick={() => onOrderOne(item)}>주문하기</button>
      </div>
    </article>
  );
}

function OrderListPage({ orders, onBack }) {
  return (
    <section className="new-page order-list-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>주문조회</h1>
      </div>
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-item" key={order.id}>
              <div className="order-item-head">
                <span className="order-item-date">
                  {order.orderedAt ? new Date(order.orderedAt).toLocaleDateString('ko-KR') : ''}
                </span>
                <span className="order-item-status">
                  {order.status === 'succeeded' || order.status === 'confirmed' ? '결제완료' : order.status}
                </span>
              </div>
              <h2>{order.productName}</h2>
              <strong>{formatMoney(order.totalAmount, order.currency)}</strong>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-list-text">주문 내역이 없습니다.</p>
      )}
    </section>
  );
}

function CartPage({ items, onBack, onProductOpen, onRemove, onQtyChange, onMoveToWish, onCheckout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState(() => items.map((item) => item.image));

  useEffect(() => {
    setSelected((current) => {
      const itemImages = items.map((item) => item.image);
      const kept = current.filter((image) => itemImages.includes(image));
      const added = itemImages.filter((image) => !current.includes(image));
      return [...kept, ...added];
    });
  }, [items]);

  const toggleSelect = (item) => {
    setSelected((current) => (
      current.includes(item.image)
        ? current.filter((image) => image !== item.image)
        : [...current, item.image]
    ));
  };

  const allSelected = items.length > 0 && selected.length === items.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? [] : items.map((item) => item.image));
  };

  const deleteSelected = () => {
    items.filter((item) => selected.includes(item.image)).forEach((item) => onRemove(item));
  };

  const selectedItems = items.filter((item) => selected.includes(item.image));
  const originalTotal = selectedItems.reduce((sum, item) => (
    sum + (getPriceNumber(item.oldPrice) || getPriceNumber(item.price)) * (item.qty || 1)
  ), 0);
  const discountTotal = selectedItems.reduce((sum, item) => sum + getDiscountAmount(item) * (item.qty || 1), 0);
  const shippingTotal = selectedItems.length > 0 ? 3000 : 0;
  const payTotal = originalTotal - discountTotal + shippingTotal;

  return (
    <section className="cart-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>장바구니</h1>
      </div>

      {items.length > 0 ? (
        <>
          <div className="cart-section-head">
            <span>장바구니 상품</span>
            <button type="button" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? '펼치기' : '접기'}>
              {collapsed ? '+' : '-'}
            </button>
          </div>

          {!collapsed && (
            <div className="cart-item-list">
              {items.map((item) => (
                <CartItemRow
                  item={item}
                  selected={selected.includes(item.image)}
                  onToggleSelect={toggleSelect}
                  onOpen={onProductOpen}
                  onRemove={onRemove}
                  onQtyChange={onQtyChange}
                  onMoveToWish={onMoveToWish}
                  onOrderOne={(orderItem) => onCheckout([orderItem])}
                  key={item.image}
                />
              ))}
            </div>
          )}

          <div className="cart-bulk-row">
            <span>[기본배송]</span>
            <div>
              <button type="button" onClick={toggleSelectAll}>{allSelected ? '전체해제' : '전체선택'}</button>
              <button type="button" onClick={deleteSelected} disabled={selected.length === 0}>선택삭제</button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>총 상품금액</span>
              <span>{originalTotal.toLocaleString()}원</span>
            </div>
            <div className="cart-summary-row">
              <span>총 할인금액</span>
              <span>-{discountTotal.toLocaleString()}원</span>
            </div>
            <div className="cart-summary-row">
              <span>총 배송비</span>
              <span>{shippingTotal.toLocaleString()}원</span>
            </div>
            <div className="cart-summary-total">
              <span>결제예정금액</span>
              <strong>{payTotal.toLocaleString()}원</strong>
            </div>
          </div>

          <div className="cart-order-buttons">
            <button type="button" disabled={selected.length === 0} onClick={() => onCheckout(selectedItems)}>선택상품주문</button>
            <button className="primary" type="button" onClick={() => onCheckout(items)}>전체상품주문</button>
          </div>
          <p className="cart-order-note">할인 적용 금액은 주문서의 결제예정금액에서 확인 가능합니다.</p>
        </>
      ) : (
        <p className="empty-list-text">장바구니에 담긴 상품이 없습니다.</p>
      )}
    </section>
  );
}

function BrandMenuPage({ onBack, onSelect }) {
  return (
    <section className="new-page brand-menu-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>브랜드</h1>
      </div>
      <div className="brand-menu-grid">
        {Object.entries(brandProducts).map(([key, brand]) => (
          <button type="button" onClick={() => onSelect(key)} key={key}>
            <span>
              <img src={`/images/${brand.image}`} alt="" />
            </span>
            <strong>{brand.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}

function MyPage({ user, onLogin, onSignup, onSocialLogin, onLogout, authError, authLoading, cartCount, wishCount, orderCount, onPolarShop, onOrderList }) {
  const [mode, setMode] = useState('social');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [localError, setLocalError] = useState('');

  const submitLogin = (event) => {
    event.preventDefault();
    onLogin(email, password);
  };

  const submitSignup = (event) => {
    event.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('이름을 입력해 주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setLocalError('비밀번호가 서로 달라요.');
      return;
    }

    onSignup(name, email, password);
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setLocalError('');
  };

  if (user) {
    return (
      <section className="my-page">
        <h1>MY</h1>
        <div className="my-profile">
          <strong>{user.displayName || '덕질메이트 회원'}님</strong>
          <p>{user.email}</p>
          <button type="button" onClick={onLogout}>로그아웃</button>
        </div>
        <div className="my-summary">
          <div>
            <strong>{cartCount}</strong>
            <span>장바구니</span>
          </div>
          <div>
            <strong>{wishCount}</strong>
            <span>관심상품</span>
          </div>
          <div>
            <strong>{orderCount}</strong>
            <span>주문내역</span>
          </div>
        </div>
        <div className="my-menu-list">
          <button type="button" onClick={onOrderList}>주문조회<span>›</span></button>
          {['배송지 관리', '쿠폰함', '최근 본 상품', '고객센터'].map((menu) => (
            <button type="button" key={menu}>{menu}<span>›</span></button>
          ))}
        </div>
      </section>
    );
  }

  if (mode === 'signup') {
    return (
      <section className="login-page">
        <button className="auth-back-button" type="button" onClick={() => switchMode('social')}>← 로그인으로</button>
        <h1>회원가입</h1>
        <p>이름과 이메일을 입력하고 덕질메이트 회원 혜택을 시작해 보세요.</p>
        <form className="login-form" onSubmit={submitSignup}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            autoComplete="new-password"
          />
          {(localError || authError) && <span className="auth-error">{localError || authError}</span>}
          <button type="submit" disabled={authLoading}>
            {authLoading ? '처리 중...' : '가입 완료'}
          </button>
        </form>
      </section>
    );
  }

  if (mode === 'emailLogin') {
    return (
      <section className="login-page email-login-page">
        <button className="auth-back-button" type="button" onClick={() => switchMode('social')}>← 로그인으로</button>
        <h1>이메일 로그인</h1>
        <p>가입한 이메일과 비밀번호를 입력해 주세요.</p>
        <form className="login-form" onSubmit={submitLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {authError && <span className="auth-error">{authError}</span>}
          <button type="submit" disabled={authLoading}>
            {authLoading ? '처리 중...' : '로그인'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="login-page">
      <h2 className="simple-login-title">간편로그인</h2>
      <div className="social-login-buttons">
        <button className="google" type="button" onClick={() => onSocialLogin('google')} disabled={authLoading}>
          <b>G</b> 구글로 계속하기
        </button>
        <button className="github" type="button" onClick={() => onSocialLogin('github')} disabled={authLoading}>
          <b>GH</b> 깃허브로 계속하기
        </button>
      </div>
      {authError && <span className="auth-error social-error">{authError}</span>}
      <div className="email-auth-links">
        <button type="button" onClick={() => switchMode('emailLogin')}>이메일로 로그인</button>
        <i />
        <button type="button" onClick={() => switchMode('signup')}>이메일로 가입</button>
      </div>
    </section>
  );
}

function CartConfirmModal({ onGoCart, onContinue }) {
  return (
    <div className="cart-modal-backdrop" role="presentation">
      <div className="cart-modal" role="dialog" aria-modal="true" aria-label="장바구니 확인">
        <h2>장바구니에 담겼습니다</h2>
        <p>장바구니로 이동하시겠습니까?</p>
        <div>
          <button type="button" onClick={onContinue}>계속 쇼핑</button>
          <button type="button" onClick={onGoCart}>장바구니 이동</button>
        </div>
      </div>
    </div>
  );
}

function FloatingActions({ visible, onToggleRecent, onScrollTop, onScrollBottom }) {
  return (
    <div className={`floating-actions ${visible ? 'visible' : ''}`}>
      <button type="button" aria-label="최근 본 상품" onClick={onToggleRecent}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15.5 14" />
        </svg>
      </button>
      <button type="button" aria-label="맨 위로" onClick={onScrollTop}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      <button type="button" aria-label="맨 아래로" onClick={onScrollBottom}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

function RecentViewedPanel({ items, onClose, onSelect }) {
  return (
    <div className="recent-viewed-panel" role="dialog" aria-label="최근 본 상품">
      <div className="recent-viewed-head">
        <h2>최근 본 상품</h2>
        <button type="button" aria-label="닫기" onClick={onClose}>×</button>
      </div>
      {items.length > 0 ? (
        <div className="recent-viewed-list">
          {items.map((item) => (
            <button type="button" className="recent-viewed-item" onClick={() => onSelect(item)} key={item.image}>
              <img src={`/images/${item.image}`} alt={item.title} />
              <div>
                <p>{item.title}</p>
                {item.oldPrice && <em>{item.oldPrice}</em>}
                <strong>{item.price}</strong>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-list-text">최근 본 상품이 없습니다.</p>
      )}
    </div>
  );
}

function DetailBuyBar({ item, onCart, onWish, onBuyNow, wished = false }) {
  return (
    <div className="detail-buy-bar">
      <button
        className={wished ? 'active' : ''}
        type="button"
        aria-label="관심상품 담기"
        onClick={() => onWish?.(item)}
      >
        {wished ? '찜함' : '찜'}
      </button>
      <button type="button" onClick={() => onCart?.(item)}>
        <HeaderIcon type="cart" label="장바구니" />
      </button>
      <button type="button" onClick={() => onBuyNow?.(item)}>바로구매</button>
    </div>
  );
}

function ProductDetailPage({ item, onBack, onWish, wished = false }) {
  return (
    <section className="detail-page">
      <div className="detail-hero">
        <img src={`/images/${item.image}`} alt={item.title} />
      </div>

      <div className="detail-summary">
        <p>{item.brand}</p>
        <h1>{item.title}</h1>
        <button
          className={wished ? 'active' : ''}
          type="button"
          aria-label="관심상품 담기"
          onClick={() => onWish?.(item)}
        >
          {wished ? '찜함' : '찜'}
        </button>
        <em>{item.oldPrice}</em>
        <strong><span>{item.discount || '0%'}</span> {item.price}</strong>
        <dl>
          <div><dt>국내·해외배송</dt><dd>국내배송</dd></div>
          <div><dt>배송방법</dt><dd>택배</dd></div>
          <div><dt>배송비</dt><dd>3,000원</dd></div>
        </dl>
      </div>

      <div className="detail-placeholder">상세설명 상품 이미지</div>

      <div className="detail-tabs">
        <a href="#detail-info">상세정보</a>
        <a href="#detail-review">리뷰 0</a>
        <a href="#detail-qna">문의 0</a>
        <a href="#detail-guide">구매안내</a>
      </div>

      <section className="detail-panel" id="detail-info">
        <div className="detail-placeholder slim">상세페이지 이미지</div>
      </section>

      <section className="detail-panel" id="detail-review">
        <h2>리뷰</h2>
        <div className="review-score">
          <b>구매 총 평점</b>
          <span>☆☆☆☆☆</span>
          <p>게시물이 없습니다</p>
        </div>
        <div className="detail-actions">
          <button type="button">전체 보기</button>
          <button type="button">후기 작성하기</button>
        </div>
      </section>

      <section className="detail-panel" id="detail-qna">
        <h2>상품문의</h2>
        <p className="empty-text">게시물이 없습니다</p>
        <div className="detail-actions">
          <button type="button">전체 보기</button>
          <button type="button">문의하기</button>
        </div>
      </section>

      <section className="detail-panel" id="detail-guide">
        <h2>구매안내</h2>
        {['상품결제정보', '배송정보', '교환 및 반품정보', '서비스문의'].map((label) => (
          <button className="guide-row" type="button" key={label}>{label}<span>›</span></button>
        ))}
      </section>

      <FooterSection />
    </section>
  );
}

function useHorizontalProductScrollbar(resetKey) {
  const rowRef = React.useRef(null);
  const barRef = React.useRef(null);
  const [thumb, setThumb] = useState({ left: 0, width: 48 });

  const updateThumb = React.useCallback(() => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar || row.scrollWidth <= 0) return;

    const maxScroll = row.scrollWidth - row.clientWidth;
    const barWidth = bar.clientWidth;
    const thumbWidth = maxScroll > 0 ? Math.max(42, (row.clientWidth / row.scrollWidth) * barWidth) : barWidth;
    const maxLeft = Math.max(barWidth - thumbWidth, 0);
    const left = maxScroll > 0 ? (row.scrollLeft / maxScroll) * maxLeft : 0;
    const thumbEl = bar.querySelector('span');

    if (thumbEl) {
      thumbEl.style.left = `${left}px`;
      thumbEl.style.width = `${thumbWidth}px`;
    }

    setThumb({ left, width: thumbWidth });
  }, []);

  useEffect(() => {
    updateThumb();
    window.addEventListener('resize', updateThumb);

    return () => window.removeEventListener('resize', updateThumb);
  }, [updateThumb]);

  useEffect(() => {
    if (rowRef.current) rowRef.current.scrollLeft = 0;
    window.requestAnimationFrame(updateThumb);
  }, [resetKey, updateThumb]);

  const moveScrollFromPointer = (clientX) => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar) return;

    const rect = bar.getBoundingClientRect();
    const maxScroll = row.scrollWidth - row.clientWidth;
    const maxLeft = Math.max(bar.clientWidth - thumb.width, 0);
    const nextLeft = Math.min(Math.max(clientX - rect.left - thumb.width / 2, 0), maxLeft);

    row.scrollLeft = maxLeft > 0 ? (nextLeft / maxLeft) * maxScroll : 0;
    updateThumb();
  };

  const handleScrollbarPointerDown = (event) => {
    event.preventDefault();
    moveScrollFromPointer(event.clientX);

    const handlePointerMove = (moveEvent) => moveScrollFromPointer(moveEvent.clientX);
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;

    bar.addEventListener('pointerdown', handleScrollbarPointerDown);
    return () => bar.removeEventListener('pointerdown', handleScrollbarPointerDown);
  });

  return { rowRef, barRef, thumb, updateThumb, handleScrollbarPointerDown };
}

function CharacterSection({ activeCharacter, onSelectCharacter, onMore, onProductOpen, onWish, onCart, wishedItems }) {
  const current = characterProducts[activeCharacter] || characterProducts.rilakkuma;
  const currentItems = current.preview || current.items || [];
  const { rowRef, barRef, thumb, updateThumb, handleScrollbarPointerDown } = useHorizontalProductScrollbar(activeCharacter);

  return (
    <section className="character-section content-section">
      <div className="section-head">
        <h2>CHARACTER EXHIBITION</h2>
        <button type="button" onClick={onMore}>더보기</button>
      </div>
      <div className="character-tabs">
        {Object.entries(characterProducts).map(([key, brand]) => (
          <button className={activeCharacter === key ? 'active' : ''} type="button" onClick={() => onSelectCharacter(key)} key={key}>
            {brand.label}
          </button>
        ))}
      </div>
      <div className="new-product-grid character-product-row" ref={rowRef} onScroll={updateThumb}>
        {currentItems.map((item) => (
          <ProductCard
            item={item}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
      <div className="new-scrollbar" ref={barRef} aria-label="캐릭터 상품 가로 스크롤"><span style={{ left: thumb.left, width: thumb.width }} /></div>
    </section>
  );
}

function CharacterPage({ activeCharacter, onBack, onProductOpen, onWish, onCart, wishedItems }) {
  const current = characterProducts[activeCharacter] || characterProducts.rilakkuma;

  return (
    <section className="new-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>{current.label}</h1>
      </div>
      <div className="new-page-grid">
        {current.items.map((item) => (
          <ProductCard
            item={item}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
    </section>
  );
}

function NewItemSection({ onMore, onProductOpen, onWish, onCart, wishedItems }) {
  const { rowRef, barRef, thumb, updateThumb } = useHorizontalProductScrollbar('new-items');

  return (
    <section className="new-item-section content-section">
      <div className="section-head">
        <h2>NEW ITEM</h2>
        <button type="button" onClick={onMore}>더보기</button>
      </div>
      <div className="new-item-preview new-product-grid" ref={rowRef} onScroll={updateThumb}>
        {newItems.map((item) => (
          <ProductCard
            item={item}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
      <div className="new-scrollbar" ref={barRef} aria-label="신상 상품 가로 스크롤"><span style={{ left: thumb.left, width: thumb.width }} /></div>
    </section>
  );
}

function NewItemPage({ onBack, onProductOpen, onWish, onCart, wishedItems }) {
  return (
    <section className="new-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>NEW ITEM</h1>
      </div>
      <div className="new-page-grid">
        {newItems.map((item) => (
          <ProductCard
            item={item}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
    </section>
  );
}

function RankingCard({ item, index, onOpen, onWish, onCart, wished = false }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <article className={`ranking-card ${item.discount ? 'has-discount' : 'no-discount'}`} onClick={() => onOpen?.(item)}>
      <div className="ranking-image">
        <i>{index + 1}</i>
        <img src={`/images/${item.image}`} alt={item.title} />
        <button
          className="quick-view-trigger"
          type="button"
          aria-label="빠른보기"
          onClick={(event) => {
            event.stopPropagation();
            setQuickViewOpen(true);
          }}
        >
          <HeaderIcon type="search" label="빠른보기" />
        </button>
        <ProductActionButtons item={item} onWish={onWish} onCart={onCart} wished={wished} />
      </div>
      <p>{item.brand}</p>
      <h3>{item.title}</h3>
      <em>{item.oldPrice}</em>
      <strong><span>{item.discount}</span> {item.price}</strong>
      {quickViewOpen && (
        <QuickViewOverlay
          item={item}
          wished={wished}
          onWish={onWish}
          onCart={(cartItem) => {
            setQuickViewOpen(false);
            onCart?.(cartItem);
          }}
          onViewDetail={() => {
            setQuickViewOpen(false);
            onOpen?.(item);
          }}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </article>
  );
}

function RankingSection({ onProductOpen, onWish, onCart, wishedItems }) {
  const [activeTab, setActiveTab] = useState('인테리어');
  const rowRef = React.useRef(null);
  const barRef = React.useRef(null);
  const [thumb, setThumb] = useState({ left: 0, width: 104 });
  const rankingItems = rankingItemsByTab[activeTab];

  const updateThumb = () => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar) return;

    const maxScroll = row.scrollWidth - row.clientWidth;
    const barWidth = bar.clientWidth;
    const thumbWidth = Math.max(42, (row.clientWidth / row.scrollWidth) * barWidth);
    const maxLeft = barWidth - thumbWidth;
    const left = maxScroll > 0 ? (row.scrollLeft / maxScroll) * maxLeft : 0;

    setThumb({ left, width: thumbWidth });
  };

  useEffect(() => {
    updateThumb();
    window.addEventListener('resize', updateThumb);

    return () => window.removeEventListener('resize', updateThumb);
  }, []);

  useEffect(() => {
    if (rowRef.current) rowRef.current.scrollLeft = 0;
    updateThumb();
  }, [activeTab]);

  const moveScrollFromPointer = (clientX) => {
    const row = rowRef.current;
    const bar = barRef.current;
    if (!row || !bar) return;

    const rect = bar.getBoundingClientRect();
    const maxScroll = row.scrollWidth - row.clientWidth;
    const maxLeft = bar.clientWidth - thumb.width;
    const nextLeft = Math.min(Math.max(clientX - rect.left - thumb.width / 2, 0), maxLeft);

    row.scrollLeft = maxLeft > 0 ? (nextLeft / maxLeft) * maxScroll : 0;
    updateThumb();
  };

  const handleScrollbarPointerDown = (event) => {
    event.preventDefault();
    moveScrollFromPointer(event.clientX);

    const handlePointerMove = (moveEvent) => moveScrollFromPointer(moveEvent.clientX);
    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <section className="ranking-section">
      <div className="ranking-tabs">
        {['인테리어', '파우치', '스티커'].map((tab) => (
          <button
            className={activeTab === tab ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab(tab)}
            key={tab}
          >
            {tab}
          </button>
        ))}
      </div>
      <h2>RANKING</h2>
      <div className="ranking-row" ref={rowRef} onScroll={updateThumb}>
        {rankingItems.map((item, index) => (
          <RankingCard
            item={item}
            index={index}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
      <div
        className="ranking-scrollbar"
        ref={barRef}
        onPointerDown={handleScrollbarPointerDown}
        role="scrollbar"
        aria-label="랭킹 상품 가로 스크롤"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={Math.round(thumb.left)}
      >
        <span style={{ left: thumb.left, width: thumb.width }} />
      </div>
    </section>
  );
}

function BestSection({ onMore, onProductOpen, onWish, onCart, wishedItems }) {
  return (
    <section className="best-section content-section">
      <div className="section-head">
        <h2>BEST ITEM</h2>
        <button type="button" onClick={onMore}>더보기</button>
      </div>
      <div className="best-grid">
        {bestItems.map((item) => (
          <ProductCard
            item={item}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
    </section>
  );
}

function BestPage({ onBack, onProductOpen, onWish, onCart, wishedItems }) {
  return (
    <section className="new-page">
      <div className="subpage-head">
        <button type="button" onClick={onBack} aria-label="Back"><BackIcon /></button>
        <h1>BEST</h1>
      </div>
      <div className="new-page-grid">
        {bestItems.map((item) => (
          <ProductCard
            item={item}
            onOpen={onProductOpen}
            onWish={onWish}
            onCart={onCart}
            wished={wishedItems.some((wishItem) => wishItem.image === item.image)}
            key={item.image}
          />
        ))}
      </div>
    </section>
  );
}

function BrandStorySection() {
  return (
    <section className="brand-story-section">
      <p>BRAND STORY</p>
      <h2>덕질메이트</h2>
      <span>행복해지는 마법, 정품 굿즈는 덕질메이트</span>
      <a href="#">상품 보러가기</a>
      <div className="brand-story-grid">
        <img src="/images/브랜드스토리1.jpg" alt="브랜드스토리 굿즈" />
        <img src="/images/브랜드스토리2.png" alt="브랜드스토리 굿즈" />
        <img src="/images/먼작3.jPG" alt="먼작귀 굿즈" />
      </div>
      <img className="brand-story-main" src="/images/브랜드스토리4.jpg" alt="브랜드스토리 대표 굿즈" />
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="site-footer">
      <img src="/images/logo.png" alt="덕질메이트" />
      <nav>
        <a href="#">회사소개</a>
        <a href="#">이용약관</a>
        <a href="#">개인정보처리방침</a>
        <a href="#">이용안내</a>
      </nav>
      <div className="footer-info">
        <p>법인명(상호): 덕질메이트(DMH) <span>대표자: 최현경</span></p>
        <p>주소: 서울특별시 종로구 종로63가길 8, 5층</p>
        <p>전화: 070-8064-3467</p>
        <p>개인정보보호책임자: 최현경(duckjilmate@gmail.com)</p>
        <p>사업자등록번호: 4570402406</p>
        <p>통신판매업 신고: 제2025-서울종로-0190호</p>
      </div>
      <strong>070-8064-3467</strong>
      <div className="footer-hours">
        <p>평일: 09:00~17:00</p>
        <p>점심시간: 12:00~13:00</p>
        <p>주말 및 공휴일은 휴무입니다.</p>
      </div>
      <div className="footer-social">
        <img src="/images/Link-3.png" alt="채널톡" />
        <img src="/images/Link.png" alt="인스타그램" />
        <img src="/images/Link-1.png" alt="유튜브" />
        <img src="/images/Link-2.png" alt="블로그" />
      </div>
      <p className="footer-safe">
        고객님의 안전거래를 위해 결제 시 구매안전 서비스를 이용하실 수 있습니다.<br />
        [서비스 가입사실 확인]
      </p>
      <p className="footer-copy">Copyright DMH. All rights reserved.</p>
    </footer>
  );
}

function LeftSearch({ selectedCategory, onCategorySelect, onBrandSelect }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);

  useEffect(() => {
    setCategoryOpen(false);
    setBrandOpen(false);
  }, []);

  return (
    <aside className="left-search">
      <div className="search-box-area">
        <p className="magic-copy">
          <span>A Little Magic,</span>
          <span>A Lot of</span>
          <span>Happiness.</span>
        </p>
        <p>즐거움을 모아, 당신만의 취향을 만나보세요.</p>
        <img src="/images/logo.png" alt="덕질메이트" />
        <nav className="left-menu" aria-label="Desktop category menu">
          <div className={`left-menu-group ${categoryOpen ? 'open' : ''}`}>
            <button
              className="left-menu-title"
              type="button"
              onClick={() => {
                const nextOpen = !categoryOpen;
                setCategoryOpen(nextOpen);
                if (nextOpen) setBrandOpen(false);
              }}
            >
              <span>카테고리</span>
              <span aria-hidden="true"><MenuChevronIcon /></span>
            </button>
            <div className="left-menu-panel">
              {leftShopCategories.map((category) => (
                <button
                  className={selectedCategory === category ? 'active' : ''}
                  type="button"
                  onClick={() => onCategorySelect(category)}
                  key={category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className={`left-menu-group ${brandOpen ? 'open' : ''}`}>
            <button
              className="left-menu-title"
              type="button"
              onClick={() => {
                const nextOpen = !brandOpen;
                setBrandOpen(nextOpen);
                if (nextOpen) setCategoryOpen(false);
              }}
            >
              <span>브랜드</span>
              <span aria-hidden="true"><MenuChevronIcon /></span>
            </button>
            <div className="left-menu-panel brand-panel">
              {Object.entries(brandProducts).map(([key, brand]) => (
                <button type="button" onClick={() => onBrandSelect(key)} key={key}>
                  {brand.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}

function MobileSiteFrame({ desktopCategoryRequest, desktopBrandRequest, selectedCategory, onCategorySelect }) {
  const frameRef = React.useRef(null);
  const [page, setPage] = useState(() => (window.location.pathname === '/success' ? 'success' : 'home'));
  const [successCheckoutId] = useState(() => new URLSearchParams(window.location.search).get('checkout_id'));
  const [activeCharacter, setActiveCharacter] = useState('rilakkuma');
  const [activeBrand, setActiveBrand] = useState('rilakkuma');
  const [activeIconCategory, setActiveIconCategory] = useState('interior');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishItems, setWishItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [recentItems, setRecentItems] = useState([]);
  const [recentPanelOpen, setRecentPanelOpen] = useState(false);
  const [showFloatingActions, setShowFloatingActions] = useState(false);
  const [user, setUser] = useState(null);
  const [savedItemsReady, setSavedItemsReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const mobileSearchInputRef = React.useRef(null);
  const compactPages = ['my', 'wish', 'brand-menu', 'cart', 'checkout', 'search', 'polar-shop', 'success', 'orders'];
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedSearchQuery
    ? allSearchItems.filter((item) => (
      [item.brand, item.title, item.price]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearchQuery))
    ))
    : [];

  useEffect(() => {
    frameRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [page, activeBrand]);

  useEffect(() => {
    if (page !== 'search') return;
    window.requestAnimationFrame(() => mobileSearchInputRef.current?.focus());
  }, [page]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setWishItems([]);
        setCartItems([]);
        setOrders([]);
        setSavedItemsReady(true);
        return;
      }

      const local = readLocalSavedItems(nextUser.uid);

      try {
        const snapshot = await getDoc(doc(db, 'savedItems', nextUser.uid));
        if (snapshot.exists()) {
          const data = snapshot.data();
          setWishItems(cleanSavedItems(data.wishItems));
          setCartItems(cleanSavedItems(data.cartItems));
          setOrders(cleanOrders(data.orders));
        } else {
          setWishItems(local.wishItems);
          setCartItems(local.cartItems);
          setOrders(local.orders);
        }
      } catch {
        setWishItems(local.wishItems);
        setCartItems(local.cartItems);
        setOrders(local.orders);
      } finally {
        setSavedItemsReady(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user || !savedItemsReady) return;
    writeLocalSavedItems(user.uid, wishItems, cartItems, orders);

    const timer = window.setTimeout(() => {
      setDoc(
        doc(db, 'savedItems', user.uid),
        {
          wishItems: cleanSavedItems(wishItems),
          cartItems: cleanSavedItems(cartItems),
          orders: cleanOrders(orders),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      ).catch(() => {});
    }, 600);

    return () => window.clearTimeout(timer);
  }, [wishItems, cartItems, orders, user, savedItemsReady]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const revealSelector = [
      '.main-banner',
      '.icon-category-row',
      '.new-item-section',
      '.character-section',
      '.brand-story-section',
      '.ranking-section',
      '.best-section',
      '.review-event-section',
      '.review-section',
      '.footer-section',
      '.brand-menu-page',
      '.product-detail-page',
      '.cart-page',
      '.checkout-page',
      '.my-page',
      '.ranking-card',
      '.review-card',
    ].join(',');

    const revealTimer = window.setTimeout(() => {
      const targets = Array.from(frame.querySelectorAll(revealSelector));

      if (!targets.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => {
              const aRect = a.target.getBoundingClientRect();
              const bRect = b.target.getBoundingClientRect();
              return (aRect.top - bRect.top) || (aRect.left - bRect.left);
            });

          visibleEntries.forEach((entry, index) => {
            entry.target.style.setProperty('--reveal-delay', `${index * 90}ms`);
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        {
          root: frame,
          threshold: 0.08,
          rootMargin: '0px 0px -10% 0px',
        },
      );

      targets.forEach((target) => {
        target.classList.add('reveal-on-scroll');
        target.classList.remove('is-visible');
        target.style.setProperty('--reveal-delay', '0ms');
        observer.observe(target);
      });
    }, 60);

    const handleScroll = () => {
      setShowFloatingActions(frame.scrollTop > 400);
    };

    frame.addEventListener('scroll', handleScroll);

    return () => {
      window.clearTimeout(revealTimer);
      frame.removeEventListener('scroll', handleScroll);
    };
  }, [page, activeBrand, activeIconCategory, activeCharacter, selectedProduct]);

  useEffect(() => {
    if (!desktopCategoryRequest) return;
    goCategory(desktopCategoryRequest.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopCategoryRequest]);

  useEffect(() => {
    if (!desktopBrandRequest) return;
    openBrand(desktopBrandRequest.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desktopBrandRequest]);

  const goHome = () => {
    setMobileCategoryOpen(false);
    setPage('home');
    onCategorySelect?.(null);
  };

  const goHomeFromSuccess = () => {
    window.history.replaceState(null, '', '/');
    goHome();
  };

  const goCategory = (name) => {
    setMobileCategoryOpen(false);
    onCategorySelect?.(name);
    setPage('category');
  };

  const openProduct = (item) => {
    setMobileCategoryOpen(false);
    setSelectedProduct(item);
    setPage('detail');
    setRecentItems((current) => {
      const next = [item, ...current.filter((entry) => entry.image !== item.image)];
      return next.slice(0, 12);
    });
  };

  const openBrand = (key) => {
    setMobileCategoryOpen(false);
    setActiveBrand(key);
    setPage('brand');
  };

  const goBrand = () => {
    setMobileCategoryOpen(false);
    setPage('brand-menu');
  };

  const scrollToTop = () => {
    frameRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    frameRef.current?.scrollTo({ top: frameRef.current.scrollHeight, behavior: 'smooth' });
  };

  const addWishItem = (item) => {
    setWishItems((items) => (
      items.some((savedItem) => savedItem.image === item.image)
        ? items.filter((savedItem) => savedItem.image !== item.image)
        : [item, ...items]
    ));
  };

  const addOrder = (order) => {
    setOrders((current) => (
      current.some((saved) => saved.id === order.id)
        ? current.map((saved) => (saved.id === order.id ? { ...saved, ...order } : saved))
        : [order, ...current]
    ));
  };

  const addCartItem = (item) => {
    setCartItems((items) => {
      const existing = items.find((savedItem) => savedItem.image === item.image);

      return existing
        ? items.map((savedItem) => (
          savedItem.image === item.image ? { ...savedItem, qty: (savedItem.qty || 1) + 1 } : savedItem
        ))
        : [{ ...item, qty: 1 }, ...items];
    });
    setShowCartModal(true);
  };

  const updateCartQty = (item, delta) => {
    setCartItems((items) => items.map((savedItem) => (
      savedItem.image === item.image
        ? { ...savedItem, qty: Math.max(1, (savedItem.qty || 1) + delta) }
        : savedItem
    )));
  };

  const moveCartItemToWish = (item) => {
    setWishItems((items) => (
      items.some((savedItem) => savedItem.image === item.image) ? items : [item, ...items]
    ));
    setCartItems((items) => items.filter((savedItem) => savedItem.image !== item.image));
  };

  const removeWishItem = (item) => {
    setWishItems((items) => items.filter((savedItem) => savedItem.image !== item.image));
  };

  const removeCartItem = (item) => {
    setCartItems((items) => items.filter((savedItem) => savedItem.image !== item.image));
  };

  const goCart = () => {
    setPage('cart');
    setShowCartModal(false);
  };

  const goCheckout = (items = cartItems) => {
    setCheckoutItems(items);
    setPage('checkout');
    setShowCartModal(false);
  };

  const goMy = () => {
    setPage('my');
  };

  const goOrders = () => {
    setPage('orders');
  };

  const goPolarShop = () => {
    setPage('polar-shop');
  };

  const goWish = () => {
    setPage('wish');
  };

  const goSearch = () => {
    setPage('search');
    setSearchDraft('');
    setSearchQuery('');
  };

  const submitSearch = (value = searchDraft) => {
    setSearchQuery(value);
  };

  const handleSocialLogin = async (provider) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const authProvider = provider === 'github' ? new GithubAuthProvider() : new GoogleAuthProvider();
      await signInWithPopup(auth, authProvider);
    } catch (error) {
      setAuthError('로그인에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailLogin = async (email, password) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (name, email, password) => {
    setAuthLoading(true);
    setAuthError('');

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
    } catch (error) {
      setAuthError('회원가입에 실패했습니다. 이미 가입된 이메일일 수 있어요.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isWished = (item) => wishItems.some((wishItem) => wishItem.image === item.image);
  const cartItemCount = cartItems.reduce((total, item) => total + (item.qty || 1), 0);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;

    const handleMobileCategoryClick = (event) => {
      const dockButton = event.target.closest('.mobile-bottom-nav .dock-item');
      if (!dockButton) return;

      const firstDockButton = frame.querySelector('.mobile-bottom-nav .dock-item');
      if (dockButton !== firstDockButton) return;

      event.preventDefault();
      event.stopPropagation();
      setMobileCategoryOpen((open) => !open);
    };

    frame.addEventListener('click', handleMobileCategoryClick, true);
    return () => frame.removeEventListener('click', handleMobileCategoryClick, true);
  }, []);

  return (
    <>
    <div className="mobile-frame" ref={frameRef}>
      <div className={`mobile-site ${compactPages.includes(page) ? 'compact-page' : ''}`}>
        <TopBanner />
        <header className="mobile-header">
          <button className="mobile-logo-button" type="button" onClick={goHome} aria-label="홈으로 이동">
            <img src="/images/logo.png" alt="덕질메이트" />
          </button>
          <div className="mobile-actions">
            <button className="header-action-button" type="button" onClick={goSearch} aria-label="검색">
              <HeaderIcon type="search" label="검색" />
            </button>
            <button className="header-action-button" type="button" onClick={goCart} aria-label="장바구니 확인">
              <HeaderIcon type="cart" label="장바구니" />
              {cartItemCount > 0 && <span>{cartItemCount}</span>}
            </button>
            <button className="header-action-button" type="button" onClick={goWish} aria-label="위시리스트 확인">
              <HeaderIcon type="heart" label="위시리스트" />
            </button>
          </div>
        </header>
        <nav className="mobile-tabs" aria-label="카테고리">
          {mobileCategories.map((category) => (
            <button
              type="button"
              className={selectedCategory === category ? 'active' : ''}
              onClick={() => goCategory(category)}
              key={category}
            >
              {category}
            </button>
          ))}
        </nav>

        {page === 'home' ? (
          <>
            <MainBannerSlider onProductOpen={openProduct} />
            <IconCategoryRow onSelect={(key) => { setActiveIconCategory(key); setPage('icon-category'); }} />
            <NewItemSection
              onMore={() => setPage('new')}
              onProductOpen={openProduct}
              onWish={addWishItem}
              onCart={addCartItem}
              wishedItems={wishItems}
            />
            <CharacterSection
              activeCharacter={activeCharacter}
              onSelectCharacter={setActiveCharacter}
              onMore={() => setPage('character')}
              onProductOpen={openProduct}
              onWish={addWishItem}
              onCart={addCartItem}
              wishedItems={wishItems}
            />
            <BrandStorySection />
            <RankingSection onProductOpen={openProduct} onWish={addWishItem} onCart={addCartItem} wishedItems={wishItems} />
            <BestSection onMore={() => setPage('best')} onProductOpen={openProduct} onWish={addWishItem} onCart={addCartItem} wishedItems={wishItems} />
            <FooterSection />
          </>
        ) : page === 'icon-category' ? (
          <ProductListPage
            title={iconCategoryProducts[activeIconCategory].label}
            items={iconCategoryProducts[activeIconCategory].items}
            onBack={goHome}
            onProductOpen={openProduct}
            onWish={addWishItem}
            onCart={addCartItem}
            wishedItems={wishItems}
          />
        ) : page === 'new' ? (
          <NewItemPage onBack={goHome} onProductOpen={openProduct} onWish={addWishItem} onCart={addCartItem} wishedItems={wishItems} />
        ) : page === 'best' ? (
          <BestPage onBack={goHome} onProductOpen={openProduct} onWish={addWishItem} onCart={addCartItem} wishedItems={wishItems} />
        ) : page === 'character' ? (
          <CharacterPage activeCharacter={activeCharacter} onBack={goHome} onProductOpen={openProduct} onWish={addWishItem} onCart={addCartItem} wishedItems={wishItems} />
        ) : page === 'category' ? (
          <ProductListPage
            title={selectedCategory}
            items={categoryProductsByName[selectedCategory] || allSearchItems}
            onBack={goHome}
            onProductOpen={openProduct}
            onWish={addWishItem}
            onCart={addCartItem}
            wishedItems={wishItems}
          />
        ) : page === 'search' ? (
          <SearchPage
            query={searchQuery}
            draft={searchDraft}
            results={searchResults}
            inputRef={mobileSearchInputRef}
            onDraftChange={setSearchDraft}
            onSubmit={submitSearch}
            onBack={goHome}
            onProductOpen={openProduct}
            onWish={addWishItem}
            onCart={addCartItem}
            wishedItems={wishItems}
          />
        ) : page === 'wish' ? (
          <ProductListPage
            title="위시리스트"
            items={wishItems}
            onBack={goHome}
            onProductOpen={openProduct}
            onWish={addWishItem}
            onCart={addCartItem}
            wishedItems={wishItems}
            onRemove={removeWishItem}
          />
        ) : page === 'cart' ? (
          <CartPage
            items={cartItems}
            onBack={goHome}
            onProductOpen={openProduct}
            onRemove={removeCartItem}
            onQtyChange={updateCartQty}
            onMoveToWish={moveCartItemToWish}
            onCheckout={goCheckout}
          />
        ) : page === 'checkout' ? (
          <CheckoutPage items={checkoutItems} onBack={goCart} />
        ) : page === 'brand-menu' ? (
          <BrandMenuPage onBack={goHome} onSelect={openBrand} />
        ) : page === 'brand' ? (
          <ProductListPage
            title={brandProducts[activeBrand].label}
            items={brandProducts[activeBrand].items}
            onBack={goBrand}
            onProductOpen={openProduct}
            onWish={addWishItem}
            onCart={addCartItem}
            wishedItems={wishItems}
          />
        ) : page === 'detail' && selectedProduct ? (
          <ProductDetailPage
            item={selectedProduct}
            onBack={goHome}
            onWish={addWishItem}
            wished={isWished(selectedProduct)}
          />
        ) : page === 'my' ? (
          <MyPage
            user={user}
            onLogin={handleEmailLogin}
            onSignup={handleSignup}
            onSocialLogin={handleSocialLogin}
            onLogout={handleLogout}
            authError={authError}
            authLoading={authLoading}
            cartCount={cartItems.length}
            wishCount={wishItems.length}
            orderCount={orders.length}
            onPolarShop={goPolarShop}
            onOrderList={goOrders}
          />
        ) : page === 'polar-shop' ? (
          <PolarShopPage onBack={goMy} />
        ) : page === 'orders' ? (
          <OrderListPage orders={orders} onBack={goMy} />
        ) : page === 'success' ? (
          <PaymentSuccessPanel checkoutId={successCheckoutId} onBack={goHomeFromSuccess} onOrderConfirmed={addOrder} />
        ) : (
          <CharacterPage activeCharacter={activeCharacter} onBack={goHome} onProductOpen={openProduct} onWish={addWishItem} onCart={addCartItem} wishedItems={wishItems} />
        )}

        {page === 'detail' && selectedProduct && (
          <DetailBuyBar
            item={selectedProduct}
            onCart={addCartItem}
            onWish={addWishItem}
            onBuyNow={(buyItem) => goCheckout([{ ...buyItem, qty: 1 }])}
            wished={isWished(selectedProduct)}
          />
        )}

        {mobileCategoryOpen && React.createElement(
          'div',
          { className: 'mobile-category-drawer' },
          React.createElement('button', {
            className: 'mobile-category-backdrop',
            type: 'button',
            onClick: () => setMobileCategoryOpen(false),
            'aria-label': '카테고리 닫기',
          }),
          React.createElement(
            'div',
            { className: 'mobile-category-menu' },
            React.createElement(
              'div',
              { className: 'mobile-category-menu-head' },
              React.createElement('strong', null, '카테고리'),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: () => setMobileCategoryOpen(false),
                  'aria-label': '카테고리 닫기',
                },
                '×',
              ),
            ),
            React.createElement(
              'div',
              { className: 'mobile-category-menu-list' },
              mobileCategories.map((category) => React.createElement(
                'button',
                {
                  type: 'button',
                  className: selectedCategory === category ? 'active' : '',
                  onClick: () => goCategory(category),
                  key: category,
                },
                category,
              )),
            ),
          ),
        )}

        <Dock
          className={'mobile-bottom-nav dock-version'}
          items={navItems.map(([icon, label], index) => ({
            icon: label === 'MY' ? <MyDockIcon /> : <span>{icon}</span>,
            label,
            onClick: label === 'WISH' ? goWish : label === 'MY' ? goMy : label === '브랜드' ? goBrand : goHome,
            className: (label === 'WISH' && page === 'wish')
              || (label === 'HOME' && page === 'home')
              || (label === 'MY' && page === 'my')
              || (label === '카테고리' && page === 'category')
              || (label === '브랜드' && (page === 'brand-menu' || page === 'brand'))
              ? 'active' : '',
          }))}
          panelHeight={56}
          baseItemSize={38}
          magnification={46}
        />
      </div>
    </div>

    {showCartModal && (
      <CartConfirmModal onGoCart={goCart} onContinue={() => setShowCartModal(false)} />
    )}

    <FloatingActions
      visible={showFloatingActions}
      onToggleRecent={() => setRecentPanelOpen((value) => !value)}
      onScrollTop={scrollToTop}
      onScrollBottom={scrollToBottom}
    />

    {recentPanelOpen && (
      <RecentViewedPanel
        items={recentItems}
        onClose={() => setRecentPanelOpen(false)}
        onSelect={(item) => {
          setRecentPanelOpen(false);
          openProduct(item);
        }}
      />
    )}
    </>
  );
}

function App() {
  const [introPhase, setIntroPhase] = useState('start');
  const [desktopCategoryRequest, setDesktopCategoryRequest] = useState(null);
  const [desktopBrandRequest, setDesktopBrandRequest] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleDesktopCategorySelect = (name) => {
    setSelectedCategory(name);
    setDesktopCategoryRequest({ name, id: Date.now() });
  };

  const handleDesktopBrandSelect = (key) => {
    setDesktopBrandRequest({ key, id: Date.now() });
  };

  useEffect(() => {
    const movingTimer = window.setTimeout(() => setIntroPhase('moving'), 3600);
    const doneTimer = window.setTimeout(() => setIntroPhase('done'), 5450);

    return () => {
      window.clearTimeout(movingTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  useEffect(() => {
    const MOBILE_BREAKPOINT = 820;
    const BASE_WIDTH = 320;

    const applyMobileScale = () => {
      const root = document.documentElement.style;

      if (window.innerWidth > MOBILE_BREAKPOINT) {
        root.removeProperty('--mobile-view-width');
        root.removeProperty('--mobile-scale');
        return;
      }

      const viewWidth = Math.max(BASE_WIDTH, window.innerWidth);
      root.setProperty('--mobile-view-width', `${viewWidth}px`);
      root.setProperty('--mobile-scale', `${viewWidth / BASE_WIDTH}`);
    };

    applyMobileScale();
    window.addEventListener('resize', applyMobileScale);
    return () => window.removeEventListener('resize', applyMobileScale);
  }, []);

  return (
    <ClickSpark sparkColor={'#ff7180'} sparkSize={11} sparkRadius={18} sparkCount={8} duration={420}>
      <div className={`app-stage intro-${introPhase}`}>
        <div className={'cute-backdrop'} aria-hidden={true} />
        <div className={'intro-copy'}>
          <BlurText
            text={'A Little Magic, A Lot of Happiness.'}
            delay={260}
            animateBy={'words'}
            direction={'top'}
            stepDuration={0.48}
          />
        </div>
        <div className={'integrated-layout'}>
          <LeftSearch
            selectedCategory={selectedCategory}
            onCategorySelect={handleDesktopCategorySelect}
            onBrandSelect={handleDesktopBrandSelect}
          />
          <MobileSiteFrame
            desktopCategoryRequest={desktopCategoryRequest}
            desktopBrandRequest={desktopBrandRequest}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </div>
    </ClickSpark>
  );
}

createRoot(document.getElementById('root')).render(<App />);
