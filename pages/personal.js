import React from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function Personal() { // Include navigation prop
    const navigation = useNavigation();
    return (
        <ScrollView style={styles.container}>
           <Text style={{paddingBottom: 50}}>
                서비스 이용약관{'\n\n'}

                제1조 목적{'\n'}
                본 이용약관은 “놀이터 백과”(이하 "사이트")의 서비스 이용 조건과 운영에 관한 제반 사항 규정을 목적으로 합니다.{'\n\n'}

                제2조 용어의 정의{'\n'}
                본 약관에서 사용되는 주요 용어의 정의는 다음과 같습니다.{'\n'}
                ① 회원 : 사이트의 약관에 동의하고 개인정보를 제공하여 회원으로 등록된 자로서, 사이트와의 이용계약을 체결하고 사이트를 이용하는 이용자를 말합니다.{'\n'}
                ② 이용계약 : 사이트 이용과 관련하여 사이트와 회원 간에 체결하는 계약을 말합니다.{'\n'}
                ③ 위치 정보 : 회원의 위치 정보를 기반으로 사이트에서 제공하는 정보를 말합니다.{'\n'}
                ④ 비밀번호 : 회원의 권익 보호를 위하여 회원이 설정한 문자와 숫자의 조합을 말합니다.{'\n'}
                ⑤ 운영자 : 사이트의 서비스를 관리하고 운영하는 자를 말합니다.{'\n'}
                ⑥ 해지 : 회원이 이용계약을 해약하는 것을 말합니다.{'\n\n'}

                제3조 약관 외 준칙{'\n'}
                운영자는 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.{'\n\n'}

                제4조 이용계약 체결{'\n'}
                ① 이용계약은 회원으로 등록하여 사이트를 이용하려는 자의 본 약관 내용에 대한 동의와 가입신청에 대해 운영자의 이용승낙으로 성립합니다.{'\n'}
                ② 회원으로 등록하여 서비스를 이용하려는 자는 가입신청 시 본 약관을 읽고 "동의합니다"를 선택하는 것으로 본 약관에 대한 동의 의사를 표시합니다.{'\n\n'}

                제5조 서비스 이용 신청{'\n'}
                ① 회원으로 등록하여 사이트를 이용하려는 이용자는 사이트에서 요청하는 제반 정보(비밀번호, 닉네임, 위치 정보 등)를 제공해야 합니다.{'\n'}
                ② 타인의 정보를 도용하거나 허위 정보를 등록하는 등 본인의 진정한 정보를 등록하지 않은 회원은 사이트 이용과 관련하여 아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌받을 수 있습니다.{'\n\n'}

                제6조 개인정보처리방침{'\n'}
                사이트 및 운영자는 회원 가입 시 제공한 개인정보와 위치 정보를 수집, 관리하며, 이와 관련된 부분은 사이트의 개인정보처리방침에 따릅니다. 운영자는 관계 법령이 정하는 바에 따라 회원의 개인정보와 위치 정보를 보호하기 위해 노력합니다.{'\n\n'}

                제7조 운영자의 의무{'\n'}
                ① 운영자는 이용 회원으로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우 신속하게 처리하며, 처리에 시간이 소요되는 경우 공지 또는 개별 통지를 통해 안내합니다.{'\n'}
                ② 운영자는 사이트 서비스의 안정적인 제공을 위하여 노력하며, 천재지변 등 부득이한 사유가 있을 경우 일시적으로 서비스 제공을 중지할 수 있습니다.{'\n\n'}

                제8조 회원의 의무{'\n'}
                ① 회원은 본 약관, 운영자가 정한 제반 규정, 공지사항 및 관계 법령을 준수하여야 하며, 사이트의 명예를 손상시키는 행위를 해서는 안 됩니다.{'\n'}
                ② 회원은 사이트의 명시적 동의 없이 이용 권한을 타인에게 양도할 수 없습니다.{'\n'}
                ③ 회원은 비밀번호와 위치 정보를 관리하며, 운영자나 사이트의 동의 없이 제3자에게 제공할 수 없습니다.{'\n\n'}

                제9조 서비스 이용 시간{'\n'}
                서비스 이용 시간은 연중무휴 1일 24시간을 원칙으로 하며, 시스템 정기점검 시 서비스가 일시 중단될 수 있으며, 예정된 작업은 사전에 공지합니다.{'\n\n'}

                제10조 서비스 이용 해지{'\n'}
                회원이 사이트 이용 계약을 해지하고자 할 경우 온라인을 통해 해지 신청을 해야 하며, 신청과 동시에 해당 회원의 정보를 삭제하여 더 이상 운영자가 이를 볼 수 없습니다.{'\n\n'}

                제11조 서비스 이용 제한{'\n'}
                회원이 다음 각 호에 해당하는 행위를 한 경우 사이트는 서비스 이용 제한 및 적법한 조치를 할 수 있으며, 이용계약을 해지하거나 서비스를 중지할 수 있습니다.{'\n'}
                ① 허위 내용 등록{'\n'}
                ② 타인의 사이트 이용을 방해하거나 정보를 도용하는 행위{'\n'}
                ③ 사이트 운영진, 직원, 관계자를 사칭하는 행위{'\n'}
                ④ 사이트의 인격권 또는 지적재산권을 침해하는 행위{'\n'}
                ⑤ 타 회원의 개인정보를 무단으로 수집, 저장, 공개하는 행위{'\n'}
                ⑥ 기타 관계 법령에 위배되는 행위{'\n\n'}

                제12조 게시물의 관리{'\n'}
                운영자는 게시물과 자료의 관리를 책임지며, 불법 게시물이나 자료 발견 시 삭제 조치를 합니다. 회원이 올린 게시물에 대한 책임은 게시자 본인에게 있습니다.{'\n\n'}

                제13조 게시물의 보관{'\n'}
                운영자는 사이트가 중단되는 경우 회원에게 사전 공지하고 게시물 이전을 위해 모든 조치를 합니다.{'\n\n'}

                제14조 게시물에 대한 저작권{'\n'}
                회원이 사이트 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다. 사이트는 비영리 목적에 한해 게시자의 동의 없이 게시물을 사용할 수 있습니다.{'\n\n'}

                제15조 손해배상{'\n'}
                사이트 이용으로 인한 모든 법적 책임은 회원 본인에게 있으며, 불가항력으로 인한 손해는 배상하지 않습니다.{'\n\n'}

                제16조 면책{'\n'}
                운영자는 천재지변, 회원의 고의나 과실, 통신서비스의 장애로 인한 손해에 대해 책임지지 않습니다. 회원이 게시한 자료에 대한 진위, 신뢰도 등에 대해서도 책임지지 않습니다.
            </Text>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        paddingBottom: 50,
    },
 
    
});
