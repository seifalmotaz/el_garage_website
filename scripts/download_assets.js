const fs = require('fs');
const path = require('path');
const http = require('http');

const assetsMapping = {
  // Hero
  "http://localhost:3845/assets/3db5ec6878a694c89e8e95d2a5c04f686ec4964c.png": "hero_bg.png",
  "http://localhost:3845/assets/73bc92d0c86663b32eb3fb11144e6e570f2b2b64.png": "hero_bg_decor1.png",
  "http://localhost:3845/assets/54e1dc5cbfea2fd0895d19f2de7a7c0dc6df8874.png": "hero_bg_decor2.png",
  "http://localhost:3845/assets/962bc87b89eef21431a79e93d230868212fcba4c.svg": "tag_icon.svg",
  "http://localhost:3845/assets/27c2f28661e60950dec9a0e9fec76c4565cc0f0f.svg": "search_icon.svg",
  "http://localhost:3845/assets/ad5d69d6403ab6556a7562d0d9809122f23cfa6b.svg": "logo_shield.svg",
  "http://localhost:3845/assets/27d94821349fb382401d5c75c33a20a6b1fad359.svg": "logo_text.svg",
  "http://localhost:3845/assets/3ab65c245031672220f3d4f2ae69b79c5439d222.svg": "chevron_down.svg",

  // Why Us
  "http://localhost:3845/assets/b88b04d81ade77e0cd6e4ec1c47e8ea6c96c8344.png": "why_cars.png",
  "http://localhost:3845/assets/ad1ebc6df7f1834e8ac4f0a9fe3c9f8cbea21ba5.svg": "ellipse_outline.svg",
  "http://localhost:3845/assets/f176f2f44ed697e0bf00e281d8cd22172b142677.svg": "star.svg",
  "http://localhost:3845/assets/51988779bf133b771078b791c53d6327e937a85c.svg": "radar.svg",
  "http://localhost:3845/assets/decf2c4b445c9166ab3d70c5d1cfd06d40311ecb.svg": "car_features_icon.svg",

  // Services
  "http://localhost:3845/assets/846a8284b2d490b606500e69f13568ee35ea7779.png": "services_bg.png",
  "http://localhost:3845/assets/8fd04f5df01545eaa20ad6e73f185c2a9df541af.svg": "services_bg_1.svg",
  "http://localhost:3845/assets/76a99fe9fc1de8fdc0cddbe2de65de0515982dfb.svg": "services_shadow_1.svg",
  "http://localhost:3845/assets/a9204b37a611b1db9b78d523794602ef44ac7e18.svg": "services_character_1.svg",
  "http://localhost:3845/assets/8ac1d27c16ba25f6f1fe30a15d7b2cb5879e9618.svg": "services_clipboard_1.svg",
  "http://localhost:3845/assets/2c3c9bf295fb0ea704fbed585d09d96cf1d3d5fb.svg": "services_stamp_1.svg",
  "http://localhost:3845/assets/bd9dae12405f242484294bcbdedb9ee950b2de47.svg": "services_keys_1.svg",
  "http://localhost:3845/assets/0bc5074c4736d0e70c7668894781625e24c37319.svg": "services_car_1.svg",
  "http://localhost:3845/assets/3164c321ee487a9959ec71bd53eeccd39b576633.svg": "services_bg_2.svg",
  "http://localhost:3845/assets/3b17ab4351ead204f4ee1524ebc82b4943af6111.svg": "services_shadow_2.svg",
  "http://localhost:3845/assets/c8d5c318f017583e0960197b5b9b71d3db9eb8e4.svg": "services_phone_2.svg",
  "http://localhost:3845/assets/787a2aff3a4889affca4710366ae77722c63e658.svg": "services_car_2.svg",
  "http://localhost:3845/assets/574c947f00d9fdd07240a23402c8003fec0925b7.svg": "services_pin_2.svg",
  "http://localhost:3845/assets/a30310a6404c7c0a14cd29753812ff95ad9ad9fd.svg": "services_character_2.svg",
  "http://localhost:3845/assets/8226f47d6225356fde6c277f3b8da2175bb7aae5.svg": "services_bg_3.svg",
  "http://localhost:3845/assets/5a2bf8d0a690ad4db79006f3badf3f34a9e461c8.svg": "services_shadow_3.svg",
  "http://localhost:3845/assets/b0a572c8fa1fe65c9efd76621e8eb1a4ff6a887a.svg": "services_device_3.svg",
  "http://localhost:3845/assets/aa9195c6f970ee799196c75b1de608deced26067.svg": "services_character_3.svg",
  "http://localhost:3845/assets/06cd8e5ac4069b7122cb21a78d0fc76b14928781.svg": "services_backpack_3.svg",
  "http://localhost:3845/assets/86a3a60d281d72c087723633530e8bac20cad694.svg": "services_trash_3.svg",
  "http://localhost:3845/assets/8991b3c48403a40cc212fb75c349cefbbb283dfd.svg": "arrow_left_white.svg",
  "http://localhost:3845/assets/ed1dc9cd32aecae77912189c1ab79147034e3791.svg": "tag_icon_filled.svg",

  // Car Cards (Best Selling / Featured)
  "http://localhost:3845/assets/a9404f42ea4b63c0f135e3ae684308e2f4f44672.png": "car_placeholder.png",
  "http://localhost:3845/assets/5b13857ff865e4c43583ec08f00ffa9156e23b9e.svg": "arrow_left_gray.svg",
  "http://localhost:3845/assets/48ea6bdb357fba99889fcb0de716c3baeef7f2d2.svg": "search_normal.svg",
  "http://localhost:3845/assets/1bae879ef70ed9d051ee2bbe69cec68d5967d0d7.svg": "arrow_down_gray.svg",
  "http://localhost:3845/assets/b70617a380d440feb288c68c5541c6858cc33cbf.svg": "favourite_heart.svg",
  "http://localhost:3845/assets/1befdcbd76d4b168b14aada85f7faeb5ec35acfd.svg": "play_video.svg",
  "http://localhost:3845/assets/f42bc3646b5cddd1ddfe5e4108ff1560ef009f68.svg": "car_specs_icon.svg",
  "http://localhost:3845/assets/9632885315a247da091e1e3a0ad6239a1220d128.svg": "spedometer_specs.svg",
  "http://localhost:3845/assets/fed833822b1f8100239b067a2563dc318dffbdfc.svg": "calendar_specs.svg",
  "http://localhost:3845/assets/f9deb59973d942f1c854a73852cf334870b02d0e.svg": "location_specs.svg",
  "http://localhost:3845/assets/0b1fadec5bee586a962cfb6108b80fa6bf0a7fc5.svg": "arrow_left_blue.svg",
  "http://localhost:3845/assets/5ed92c0c0887752e3686885ab3d477401238f45c.svg": "certified_shield.svg",

  // Blog
  "http://localhost:3845/assets/38850ad20eb27f44d69f06e02cc8cad1085801fa.png": "blog_placeholder.png",
  "http://localhost:3845/assets/2cd987bdb2858ec7a0e4bf2f618eb31c494e35d1.svg": "calendar_blog.svg",
  "http://localhost:3845/assets/35f5c810dc5e83e2c85f02c81bddf4f1e468c0c5.svg": "blog_pattern.svg",

  // Testimonials
  "http://localhost:3845/assets/738d6d513975864994a13e48a0ed7eaa391b73e6.svg": "arrow_left_gray_review.svg",
  "http://localhost:3845/assets/d8348b799380074b546a61eb71ffe1991a9483dc.svg": "arrow_left_blue_review.svg",
  "http://localhost:3845/assets/6a2a1ae54c373762a0e4f8c3eac5d46860026ae8.svg": "review_avatar_1a.svg",
  "http://localhost:3845/assets/c43a7fc89e76c85c5b0bbc7da632715980b1a4f4.svg": "review_avatar_1b.svg",
  "http://localhost:3845/assets/65ba4afd570f56701e880732609e543b7b0aee53.svg": "review_avatar_1c.svg",
  "http://localhost:3845/assets/d15b1e96efadeb3ebaaaca830f68bb396493e1ba.svg": "review_avatar_1d.svg",
  "http://localhost:3845/assets/d531fdd77af995a439e16feaec0e463237d06c60.svg": "review_avatar_1e.svg",
  "http://localhost:3845/assets/e9bd65c7812b5f6a3f31d99acac9ddb41181f589.svg": "review_avatar_1f.svg",
  "http://localhost:3845/assets/453fd8757cb5f75b7ba6b21ec496b95af58ae92a.svg": "review_avatar_1g.svg",
  "http://localhost:3845/assets/651db65aae2d713fd5aacc5b94b4a5e62f633c2f.svg": "review_avatar_1h.svg",
  "http://localhost:3845/assets/fef969beb8459726376fdbb3d159f4671d1fd396.svg": "review_avatar_1i.svg",
  "http://localhost:3845/assets/eb47c23ec6cc7c98cb82e03278ebb75a03d42059.svg": "review_avatar_1j.svg",
  "http://localhost:3845/assets/c5bacf4272794097cd5a95f692d733c60ff8686c.svg": "review_avatar_3a.svg",
  "http://localhost:3845/assets/1609784ef940d54823f52d12d1f1e3218b8af59c.svg": "review_avatar_3b.svg",
  "http://localhost:3845/assets/02f96bbcb048b9da320a98018ed8becd9a3e271d.svg": "review_avatar_3c.svg",
  "http://localhost:3845/assets/46b3da06fdc95bcc44f5c49d06f23d674de9f3e2.svg": "review_avatar_3d.svg",
  "http://localhost:3845/assets/e402f9e23d2824e094ec2ec93b5027dcf1f3b56f.svg": "review_avatar_3e.svg",
  "http://localhost:3845/assets/e3a54a2e151fab0efec4262c84822632141315f8.svg": "review_avatar_3f.svg",
  "http://localhost:3845/assets/178164160ef3ae5f7519548d2634a6006dcb35a6.svg": "review_avatar_3g.svg",
  "http://localhost:3845/assets/a30f495f8316eabd7c44849d1e966631217e84b1.svg": "review_avatar_3h.svg",
  "http://localhost:3845/assets/619161a1fe9e590994a109593023eb08e240d987.svg": "review_avatar_3i.svg",
  "http://localhost:3845/assets/a9404f42ea4b63c0f135e3ae684308e2f4f44672.png": "review_car_placeholder.png",

  // Mechanic Banner
  "http://localhost:3845/assets/21ee306db5fe33d180fe6a4ad7531aa6072c6552.svg": "mechanic_banner_bg_pattern.svg",
  "http://localhost:3845/assets/83a7c9ce53899e9b09c1f15112c2b581ee420587.svg": "whatsapp_logo.svg",

  // FAQ
  "http://localhost:3845/assets/828541738941aceed8cc6a00a2c2ced8bd71f360.svg": "arrow_up_faq.svg",
  "http://localhost:3845/assets/9d61e522c0c2da69835b694d9e352ed4cc5a6975.svg": "arrow_down_faq.svg",

  // Download App
  "http://localhost:3845/assets/864ed75963c0f9bd2d777a8948aeac34fa8006c8.png": "download_qrcode.png",
  "http://localhost:3845/assets/8d0f4be8f4ea9d782775eb821abf74206b32f353.png": "app_phones_mockup.png",
  "http://localhost:3845/assets/617a6d2654408fd21f8cad229602a5c7e8819aa6.svg": "download_bg_pattern.svg",
  "http://localhost:3845/assets/416d005e22bf1f996905deef852319a75eea49c2.svg": "app_store_badge.svg",
  "http://localhost:3845/assets/2fba372fbf2dd50b3f72bb6ace7b60372c78c17c.svg": "google_play_badge.svg",
  "http://localhost:3845/assets/d14ed793bc3cc5457e1b7602d543f795044e874c.svg": "download_bottom_pattern.svg",

  // Footer
  "http://localhost:3845/assets/1d0c2614ad4bd739831b22f84dbcff3424febd93.svg": "arrow_left_footer.svg",
  "http://localhost:3845/assets/ae3b6628d531c96d5711b6d0b70623e3059608a7.png": "footer_car_bg.png",
  "http://localhost:3845/assets/97f83a5d1255c12b51fb2c576fbf522382ff05d2.png": "footer_car_overlay.png",
  "http://localhost:3845/assets/55fe305552479260d4116c518fcbdc02a41ef916.svg": "social_youtube.svg",
  "http://localhost:3845/assets/2974b8a9e2c5457f49b5ff4654e38c81ad27dbaf.svg": "social_facebook.svg",
  "http://localhost:3845/assets/26f0c106b6071c99b23a44df7e8b1cc4214972fe.svg": "social_twitter.svg",
  "http://localhost:3845/assets/27f7e705aa99b8533c4df25a41f675c0bc618d18.svg": "social_instagram.svg",
  "http://localhost:3845/assets/9fb1ddfb64ee0efb400ce294291bb1ea4bfb31d8.svg": "social_instagram_2.svg",
  "http://localhost:3845/assets/01ef95d90c3063be04c5792946d34a85f58aacd1.svg": "social_instagram_3.svg",
  "http://localhost:3845/assets/7e323028bbab50f569e2132834bb6396a21f5273.svg": "logo_shield_footer.svg",
  "http://localhost:3845/assets/0ac0d04b42880947e5b5e77cc0bf29d2887c7d65.svg": "logo_text_footer.svg",
  "http://localhost:3845/assets/959c461dafef213e35e6c223f42b4544c1c668d0.svg": "mobile_footer.svg",
  "http://localhost:3845/assets/90763e07ed5c4e07aa94ec7eca470caf6ddce149.svg": "sms_footer.svg",
  "http://localhost:3845/assets/68c24cf310fed68357cabb0f368192f8afd6ec28.svg": "location_footer.svg",
  "http://localhost:3845/assets/44f20e87561bc37a4cfdb0e7b779d1c44da5c116.svg": "footer_mask.svg"
};

const outputDir = path.join(__dirname, '../public/assets');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`Starting asset downloads. Target directory: ${outputDir}`);

let completed = 0;
const entries = Object.entries(assetsMapping);

entries.forEach(([url, filename]) => {
  const destPath = path.join(outputDir, filename);
  const fileStream = fs.createWriteStream(destPath);
  
  http.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${url}: status code ${response.statusCode}`);
      fileStream.close();
      fs.unlink(destPath, () => {});
      return;
    }
    
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
      fileStream.close();
      completed++;
      console.log(`[${completed}/${entries.length}] Downloaded ${filename}`);
      if (completed === entries.length) {
        console.log('All assets downloaded successfully!');
      }
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
    fileStream.close();
    fs.unlink(destPath, () => {});
  });
});
