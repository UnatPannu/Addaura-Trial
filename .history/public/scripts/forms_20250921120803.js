<div class="forms-container">
  <div class="form-section" id="hiring-section">
    <h4>Looking for tech talent that actually fits?</h4>
    <button class="mobile-button"> I have hiring needs<img src="assets/Icons/down-arrow.png"/></button>
    <hr/>
    <form id="hiring" method="post">
      <label for="name">Name</label>
      <input type="text" placeholder="Enter Name" id="name" name="name" required />
      
      <label for="email">Email</label>
      <input type="email" placeholder="Enter Email" id="email" name="email" required />

      <label for="mobile-no">Mobile</label>
      <input type="text" placeholder="Enter Mobile No." id="mobile-no" name="mobile-no" />

      <label for="query">Message</label>
      <textarea placeholder="Enter Message Here" id="query" name="query"></textarea>
    </form>

    <p>Let’s talk about your hiring needs</p>
    <button id="hiring-submit" class="wave-button" type="button">
      <div class="text">Let's Talk</div>
      <div class="wave"></div>
    </button>

    <br/><br/>
  </div>

  <div class="form-section" id="talent-section">
    <h4>Looking for the right tech role for you?</h4>
    <button class="mobile-button"><span>I'm looking for a job</span><img src="assets/Icons/down-arrow.png"/></button>
    <hr/>
    <form id="talent" method="post" enctype="multipart/form-data">
      <label for="name-talent">Name</label>
      <input type="text" placeholder="Enter Name" id="name-talent" name="name" required />

      <label for="email-talent">Email</label>
      <input type="email" placeholder="Enter Email" id="email-talent" name="email" required />

      <label for="mobile-talent">Mobile</label>
      <input type="text" placeholder="Enter Mobile No." id="mobile-talent" name="mobile-no" />

      <label for="cv-click" id="cv-label">CV</label>
      <div id="cv-click">
        <label for="resume" id="resume-label" class="custom-file-upload">
          <img src="assets/Icons/upload-icon.svg" /> Upload File
        </label>
        <span id="file-name">No file chosen</span>
      </div>
      <input 
        type="file" 
        id="resume" 
        name="resume" 
        style="display:none;" 
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
    </form>

    <p>Let’s find the right job for you</p>
    <button id="talent-submit" class="wave-button" type="button">
      <div class="text">Send CV</div>
      <div class="wave"></div>
    </button>
  </div>
</div>
