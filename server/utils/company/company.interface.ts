import type { FuncConfig, UpsertInput } from '../base.interface'
import { Company } from './company.model'

export interface ICompanyRepository {
  selectCompanyCards(config: FuncConfig<{}>): Promise<Company[] | Company>
  insertCompany(config: UpsertInput<Company>): Promise<void>
}

// contacts (
//   id SERIAL PRIMARY KEY,
//   given_name VARCHAR(100),
//   surname VARCHAR(100),
//   title VARCHAR(100),
//   is_primary BOOLEAN NOT NULL DEFAULT false,  -- Specify NOT NULL and DEFAULT for clarity
//   email VARCHAR(255),
//   phone_number VARCHAR(50),
//   contact_type contact_type,
//   privacy_level privacy_level,
//   user_id UUID,  -- Ensure the users table has UUID as the data type for id
//   company_id INTEGER,  -- Ensure the companies table uses INTEGER for id
//   created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//   CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
//   CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
// );

// Private
// https://space-india.com/
// https://axsx.in/
// https://skyroot.in/index.html
// https://agnikul.in/#/
// https://www.pixxel.space/
// https://www.nsilindia.co.in/
// https://bellatrix.aero/
// https://www.dhruvaspace.com/
// https://www.aeroin.space/
// https://aadyah.com/
// https://astrogatelabs.com/
// https://blueskyhq.io/
// https://www.digantara.co.in/
// https://www.eonspacelabs.com/
// https://www.galaxeye.space/
// https://www.teamindus.in/
// https://satellize.com/
// https://www.satsure.co/
// https://www.axiomspace.com/
// Me
// https://www.starlabsurat.com/
// https://spacedevelopmentnexus.com/
// https://www.parasdefence.com/
// https://spaceaura.com/
// https://www.spaceroboticssociety.org/
// https://spacekidzindia.in/
// https://piersight.space/
// https://vellon.in/
// https://www.nss-mumbai.org/
// https://www.numer8.in/
// https://deltavanalytics.com/
// https://originantares.in/
// https://ananthtech.com/
// https://www.datapatternsindia.com/
// https://www.godrej.com/aerospace-and-defence
// https://nspacetech.in/
// https://www.manastuspace.com/
// https://spacim.co.in/
// https://www.digantara.co.in/
// http://www.spacefields.in/
// https://www.spaceskool.com/
// https://astramwp.com/
// https://www.azistabst.com/
// https://www.orbitx.in/
// https://www.korrai.com/
// https://skyserve.ai/
// https://www.etherealx.space/
// https://abyom.com/
// https://hexstaruniverse.com/
// https://www.dhruvaspace.com/
// https://www.spacemachines.co/
// https://suhora.com/#/
// https://dronvayu.com/
// https://www.kawa.space/
